# PayApp

This document listed how the PayApp should look like as a simple and easy-to-use Payment Processor.

## Main Page

![Main Page design](imgs/7.png)

- `Main Page` is just a very simple page with only 2 buttons on the page.
- `Background` is USD dollar image which shows the default payment price on it.
- `4 corners and bottom-center` of the page shows the price that you are gonna pay.
- `Payment currency` can change according to the currency you want to deal with it.
- `Middle-left(Red text) & Middle-Right(Green text)` of the page represents the customer id of person paying and the person receiving.
- `Bottom-left of the page` represents the currency you are going to be paid.
- `Bottom-right of the page` represents the invoice date and time on it.
- `Left yellow button` is what you can change the amount you want to pay. If you click on it, it should show the amount form up and you can change the amount there.
- `Right green button` is what you can trigger the QR code scanner. If you click on it, the QR code scanner with camera will show up and you can scan any QR code.

## Animations

#### Animations is very important for the nice UI

![Animation gif](imgs/animation.gif)

- When you click on the yello button(QR code), it should work as an animation like the gif above and show the calculator form.
- Then [Calculator logic](https://gitlab.com/cryptoems/blockchain-terminal-ui/blob/payapp/designs/docs/PayApp/logics.md#2-calculator-logic) starts.

## User Experiences

After you have sent this QR code image to the payer, the payer will scan it and in that case, the SMS verification form should show up in both sides.
`SMS verification form` should work like below.
![Verification animations](imgs/phone-number.gif)
