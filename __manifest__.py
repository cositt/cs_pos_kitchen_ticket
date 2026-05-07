# -*- coding: utf-8 -*-
{
    'name': 'Ticket Cocina',
    'version': '1.0.0',
    'category': 'Sales/Point of Sale',
    'summary': 'Personalización del ticket de cocina TPV Restaurante',
    'description': """
Personalización del ticket de cocina del TPV Restaurante.

Funcionalidades:
- Muestra número de mesa
- Muestra nombre de sala
- Muestra número de comensales (en español, reemplaza "Guest: X")
- Tamaño de letra aumentado para legibilidad
- Compatible con impresoras térmicas de 80mm

Técnico:
- Parchea PosStore.getOrderData para añadir table_name y floor_name
- Extiende point_of_sale.OrderChangeReceipt vía t-inherit
- Compatible con Odoo 19 Enterprise
    """,
    'author': 'Cositt Technology',
    'website': 'https://cositt.com',
    'license': 'LGPL-3',
    'depends': [
        'point_of_sale',
        'pos_restaurant',
    ],
    'data': [],
    'assets': {
        'point_of_sale._assets_pos': [
            'cs_pos_kitchen_ticket/static/src/scss/kitchen_ticket.scss',
            'cs_pos_kitchen_ticket/static/src/js/kitchen_ticket.js',
            'cs_pos_kitchen_ticket/static/src/xml/kitchen_ticket.xml',
        ],
    },
    'installable': True,
    'application': False,
    'auto_install': False,
}
