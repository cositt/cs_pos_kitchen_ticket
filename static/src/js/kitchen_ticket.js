/** @odoo-module **/

import { PosStore } from "@point_of_sale/app/services/pos_store";
import { renderToElement } from "@web/core/utils/render";
import { patch } from "@web/core/utils/patch";

// Cambia a false cuando tengas impresora real configurada
const CS_KITCHEN_PREVIEW = true;

patch(PosStore.prototype, {
    // Añade table_name y floor_name al objeto de datos del ticket
    getOrderData(order, reprint) {
        return {
            ...super.getOrderData(order, reprint),
            table_name: order.table_id?.name || "",
            floor_name: order.table_id?.floor_id?.name || "",
        };
    },

    async sendOrderInPreparation(order, opts = {}) {
        if (CS_KITCHEN_PREVIEW && !opts.byPassPrint) {
            const lines = order.getOrderlines().map((line) => ({
                quantity: line.getQuantity(),
                basic_name: line.product_id.name,
                note: line.getNote?.() || "",
                customer_note: line.getCustomerNote?.() || "",
                attribute_value_names: (line.attribute_value_ids || []).map((a) => a.name),
                combo_parent_uuid: line.combo_parent_id?.uuid || null,
            }));

            if (lines.length > 0) {
                const data = {
                    ...this.getOrderData(order, false),
                    changes: { title: "PEDIDO", data: lines },
                };
                await this.prepareReceiptGroupedData(data);

                const receipt = renderToElement("point_of_sale.OrderChangeReceipt", { data });
                const win = window.open("", "_blank");
                if (win) {
                    win.document.write(`
                        <html>
                        <head>
                            <title>Ticket Cocina</title>
                            <style>
                                body { font-family: monospace; max-width: 320px; margin: 20px auto; font-size: 14px; }
                                hr { border: none; border-top: 2px dashed #000; }
                                .text-center { text-align: center; }
                                .fw-bold, strong { font-weight: bold; }
                                .d-flex { display: flex; justify-content: space-between; }
                                .ms-5 { margin-left: 2em; }
                                .fst-italic { font-style: italic; }
                                .pt-5 { padding-top: 1em; }
                                .pb-5 { padding-bottom: 1em; }
                                .mb-2 { margin-bottom: 0.5em; }
                                .orderline { font-size: 1.5em; margin-bottom: 6px; }
                                .cs-kitchen-info { font-size: 1.3em; margin: 8px 0; }
                                .cs-kitchen-info div { margin: 3px 0; }
                            </style>
                        </head>
                        <body>${receipt.outerHTML}</body>
                        </html>
                    `);
                    win.document.close();
                }
            }
        }
        return super.sendOrderInPreparation(order, opts);
    },
});
