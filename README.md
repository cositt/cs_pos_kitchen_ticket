# Kitchen Ticket (Ticket Cocina)

**Version:** 1.0.0  
**Author:** Cositt Technology  
**License:** LGPL-3  
**Category:** Sales/Point of Sale

## Overview

This module provides comprehensive customization of kitchen receipt printing in Odoo Point of Sale for restaurant environments. It enhances the kitchen ticket display with essential order information including table number, floor/area name, and guest count in Spanish localization.

The module is optimized for 80mm thermal printers commonly used in restaurant kitchens, ensuring clear, readable output with proper formatting and visual hierarchy.

## Features

### Kitchen Ticket Display

- **Table Information:** Displays table number/name clearly
- **Floor/Area Identification:** Shows floor or area name for multi-floor venues
- **Guest Count:** Localized Spanish label "Comensales" instead of generic "Guest"
- **Enhanced Typography:** Increased font sizes for optimal readability in kitchen environment

### Smart Data Integration

- **Automatic Table Lookup:** Retrieves table and floor information from order data
- **Conditional Display:** Fields only appear when data is available
- **Clean Layout:** Professional, centered formatting

### Kitchen Preview Mode

- **On-Screen Preview:** Print preview dialog before sending to physical printer
- **Development Testing:** Toggle preview mode for easy testing without hardware
- **Browser Window Display:** Standard browser print dialog for preview and testing

## Installation

1. Place the module in your Odoo addons directory:
   ```bash
   cp -r cs_pos_kitchen_ticket /path/to/odoo/addons/
   ```

2. Update the module list:
   - Navigate to **Apps** > **Update Apps List**
   - Search for "Ticket Cocina" or "Kitchen Ticket"

3. Install the module:
   - Click **Install** on the module card

## Configuration

### Prerequisites

- Point of Sale module must be installed
- POS Restaurant module must be installed
- Kitchen/order printer configured in POS settings

### Restaurant Setup

1. Go to **Point of Sale > Configuration > Restaurants**
2. Configure floor and table hierarchy:
   - Create floors (e.g., "Main Floor", "Terrace", "Private Room")
   - Create tables within each floor
   - Assign table numbers and names

3. Go to **Point of Sale > Configuration > Point of Sale**
4. In your POS configuration:
   - Enable **Print Kitchen Receipts**
   - Set correct printer device
   - Configure paper width to 80mm
   - Save changes

### POS Restaurant Configuration

1. Navigate to **Point of Sale > Configuration > Restaurants**
2. Enable restaurant mode for your POS terminal
3. Ensure table and floor data is correctly set up
4. Configure kitchen printer in POS settings

## Usage

### Kitchen Ticket Workflow

1. **Order Entry:** Waiter enters order in POS
2. **Send to Kitchen:** Click "Send Order" or equivalent button
3. **Ticket Print:** Kitchen receives printed ticket with:
   - **Mesa (Table):** Table number and name
   - **Sala (Floor):** Floor or area name
   - **Comensales (Guests):** Number of customers
   - **Order Items:** Products with quantities and special notes

### Ticket Sections

The kitchen ticket displays in the following order:

1. **Restaurant/POS Header** (configured in POS settings)
2. **Table Information Block:**
   ```
   Mesa: Table 5
   Sala: Main Floor
   Comensales: 4
   ```
3. **Order Items:**
   - Product names (bold, large font)
   - Quantities
   - Special instructions (italicized, smaller font)
4. **Timestamp and order metadata**

### Preview Mode (Development)

By default, the module includes a preview mode for testing:

1. **Enable Preview:** Set `CS_KITCHEN_PREVIEW = true` in `kitchen_ticket.js`
2. **Order Sent:** A browser window opens with ticket preview
3. **Print Dialog:** Use browser print (Ctrl+P) to test physical printer
4. **Disable for Production:** Set `CS_KITCHEN_PREVIEW = false` once testing is complete

### Thermal Printer Setup

1. **Paper Size:** Use 80mm thermal paper rolls
2. **Printer Connection:** USB or network printer
3. **Driver Installation:** Ensure proper printer drivers installed
4. **Test Print:** Print test receipt from POS settings
5. **Formatting:** Module automatically formats for 80mm width

## Technical Details

### Dependencies

- `point_of_sale` (Odoo core module)
- `pos_restaurant` (Odoo core module)

### Module Components

#### 1. XML Template Override (`kitchen_ticket.xml`)

Inherits from `point_of_sale.OrderChangeReceipt` and:
- Replaces the generic "Guest: X" block with localized Spanish labels
- Adds table name, floor name, and guest count
- Centers content for professional appearance

#### 2. JavaScript Patch (`kitchen_ticket.js`)

**`getOrderData()` Override:**
- Adds `table_name` and `floor_name` to order data
- Retrieves from order's table relationship
- Returns empty string if no table assigned

**`sendOrderInPreparation()` Override:**
- Implements kitchen preview mode functionality
- Formats order data for receipt display
- Opens browser window with styled preview
- Allows testing without physical printer

#### 3. Styling (`kitchen_ticket.scss`)

```scss
.cs-kitchen-info {
  font-size: 130%;           // Large, readable text
  margin: 8px 0 4px 0;
}

.orderline {
  margin-bottom: 6px;        // Space between items
}

.product-name {
  font-weight: bold;         // Emphasis on product
}
```

### Key Implementation Details

- **Table Lookup:** Uses nested relationship `order.table_id?.floor_id?.name`
- **Null Safety:** Empty strings for missing table/floor data
- **Conditional Rendering:** Fields only display if data exists
- **Preview Mode:** Toggle via `CS_KITCHEN_PREVIEW` constant
- **Responsive Styling:** Adapts to 80mm thermal printer format

## Troubleshooting

### Kitchen Ticket Not Printing

**Problem:** No ticket is printed when order is sent to kitchen.

**Solution:**
1. Verify kitchen printer is configured:
   - Go to **Point of Sale > Configuration**
   - Check printer is selected and online
2. Test printer manually:
   - Use POS test print function
   - Verify printer connection (USB/Network)
3. Check POS logs for errors
4. Ensure module is installed and active

### Table/Floor Information Missing

**Problem:** Table name and floor name appear blank on ticket.

**Solution:**
1. Verify table is assigned to order:
   - In POS, check table is properly selected
2. Verify table configuration:
   - Go to **Restaurants > Tables**
   - Confirm table has name and floor assigned
3. Verify floor configuration:
   - Go to **Restaurants > Floors**
   - Confirm floor is created with proper name
4. Reload POS terminal to refresh data

### Preview Mode Not Working

**Problem:** Preview window doesn't open when order sent.

**Solution:**
1. Verify preview mode is enabled:
   - Check `CS_KITCHEN_PREVIEW = true` in `kitchen_ticket.js`
2. Check browser pop-up blocker:
   - May be blocking preview window
   - Whitelist POS URL in browser settings
3. Verify browser console for errors:
   - Press F12 to open developer tools
   - Check for JavaScript errors
4. Clear browser cache and reload POS

### Text Size Issues

**Problem:** Text on printed ticket is too small or too large.

**Solution:**
1. Verify paper size:
   - Use 80mm thermal paper (standard size)
2. Adjust printer settings:
   - Check print quality and scaling in printer driver
3. Customize SCSS if needed:
   - Edit `kitchen_ticket.scss`
   - Modify font-size values
   - Reload POS

### Missing Order Items

**Problem:** Some items not appearing on kitchen ticket.

**Solution:**
1. Verify items are added to order:
   - Check POS order contains all items
2. Check special requirements:
   - Some item types may not print (combo items, etc.)
3. Review order line data:
   - Check for special attributes or restrictions
4. Check kitchen printer buffer:
   - May need to clear print queue

## Development

### Preview Mode Testing

1. Keep `CS_KITCHEN_PREVIEW = true` during development
2. Test receipt formatting in browser
3. Use browser print preview (Ctrl+P)
4. Verify layout works on 80mm width simulation
5. Set `CS_KITCHEN_PREVIEW = false` before deployment

### Customization Examples

**Change Font Size:**
```scss
.cs-kitchen-info {
  font-size: 140%;  // Increase from 130%
}
```

**Add Custom Styling:**
```scss
.cs-kitchen-table {
  color: #ff0000;   // Red for emphasis
  font-weight: bold;
}
```

**Modify Labels:**
In `kitchen_ticket.xml`, change Spanish labels to other languages:
```xml
Mesa: → Table:
Sala: → Floor:
Comensales: → Guests:
```

## Support

For issues, feature requests, or technical assistance:
- **Website:** https://cositt.com
- **Email:** support@cositt.com

## Compatibility

- **Odoo Version:** 19.0 Enterprise
- **Printer Type:** 80mm Thermal Printers
- **Restaurant Module:** Required (pos_restaurant)
- **Language:** Spanish localization (customizable)

## License

This module is licensed under LGPL-3. See LICENSE file for details.

## Changelog

### Version 1.0.0
- Initial release
- Kitchen ticket customization for restaurant POS
- Table and floor information display
- Spanish localization (Comensales, Mesa, Sala)
- Thermal printer optimization (80mm)
- Preview mode for development/testing
- Compatible with Odoo 19 Enterprise
