## Easy way : Use Pawket to inscribe

- Please prepare your Pawket wallet ( [Download here](https://info.pawket.app/download/)) and ensure it contains a balance of at least 0.0005 XCH.
- Click on the 'Inscribe' button at the bottom of the Pawket to enter the inscription page.
  ![image](images/1.png =300x)

- Enter the Tick and Amount of the token you plan to inscribe(view the [Deployed List](https://unimojo.io/#/xchs).), such as "xchs" "1000", and fill in the Receiver Address (the default receiver address is the primary address of your wallet).
  ![image](images/2.png =300x)

- Choose an appropriate Network Fee. The Chia network supports zero-fee transactions, so you can choose not to fill this in, but doing so may cause longer transaction times. In case the network isn't congested, choosing a low/medium fee should suffice.

- After signing in, Pawket will automatically calculate the cost of this inscription (including service fees paid to the wallet and network fees paid to the miners). Pawket charges a service fee of 0.0005 XCH for every inscription. Additionally, 1 mojo will be temporarily consumed as a cargo coin during the inscription process, but will return to your wallet afterwards, hence it does not count as part of the total cost.
  ![image](images/3.png =300x)

- After confirming that all the information is correct, submit and wait for confirmation on the blockchain.

## Use Chia Client to inscribe

- Please prepare your [Chia client](https://www.chia.net/downloads/) and ensure that you have at least 1 mojo(which is 0.000000000001XCH) in your balance.
- On the send interface, enter your own address, input any amount of XCH (at least 0.000000000001XCH), as well as the network fee (which can be 0).
- Click on 'Add transaction memo', and type the following content like this(You can modify the content of 'tick' and 'amt' as needed):
  - `{'p':'xchs','op':'mint','tick':'xchs','amt':'1000'}`
- After checking all the above information for accuracy, click 'Send' to submit this transaction and wait for block confirmation.
  ![image](images/4.png)
