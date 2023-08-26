# PayApp

The purpose of this PayApp is to send payment from one-side to another side in a few seconds with few clicks.

[Diagram](https://www.lucidchart.com/invitations/accept/5e9c5cb7-baf6-4537-85cd-8407366926b8)

## 1. User Authentications

- The app authenticates the `user` by going through the phone number verification logic.
- Phone number verification requires the phone number to which the app is going to send 4-digit verification code for the verifications.

The case when you are asked for this verification is described in the following documents.

## 2. Calculator logic

- This logic starts when you press on the `Calculator button(QR code yellow)`.
- It will open up with the calculator form.

### Calculator form

- It will open upon the current background dollar image.
- In the center of the screen, you have the input where you can add the amount. You can add the amount you want to receive in the form. The form will follow the animations as stated in the [Design documentations](https://gitlab.com/cryptoems/blockchain-terminal-ui/blob/payapp/designs/docs/PayApp/designs.md#animations).
- After you have entered the amount there and submit, the calculator form should disappear.
- After it has been disappeared, you are back at the main page with the updated amount on the page and QR code on it.

#### Logged user

- In the top center of the screen, you have the balance box if you have logged in already.
- That box shows you the current balance in your wallet.
- If you click on it, it will open up Activity screen that is only available for logged-in user.

#### Non-logged user

- In the top center of the screen, you have Log In button if you have not logged in yet.
- If you click on it, you can move to the phone number verification screen where you can verify your account with SMS.

## 3. Scanner logic

- This scanner logic starts when you press on the `Scanner button(Green button)`.
- It will open up the scanner.

### Scanner screen

- Scanner screen works with the camera and you can scan the image or select the image from your local file system.
- Once you have scanned the right bill, you will be asked for the SMS verifications.
- Once you finish the verifications and the payee finishes the verifications, then you will be redirected to `Congratulations` page.
- `Congratulations` page is just like a popup dialog on which you have `close` button that you can go back to the Main Page.

## 4. Activity screen

This is only available for the logged in user.

This contains `Activity`, `Settings`, `Invite friends to get 5$`.

- `Activity` screen is the page where you can browse the transaction history.
- `Settings` screen is the page where you can change your wallet's currency type.
- `Invite friends to get 5%` screen is the page to invite friends.
