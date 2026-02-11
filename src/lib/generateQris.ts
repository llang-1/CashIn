import convertCRC16 from "@/lib/convertCRC";

function generateQRIS(amount: number) {
  const baseData = "00020101021126670016COM.NOBUBANK.WWW01189360050300000879140214142044767069730303UMI51440014ID.CO.QRIS.WWW0215ID20243266300330303UMI5204541153033605802ID5925LANGZ NESIA STORE OK176106007BANDUNG61054011162070703A0163047460"; // supayaa bisa mendapatkan data qris dengan cara berikut. 1. upload qris kamuu ke google lens 2. lalu bisa melihat data qris kayak gini: 00020101021126670016COM.NOBUBANK.WWW0118936005030000087914021414204... dan seterusnya.
  const qrisData = baseData.slice(0, -4);

  const step1 = qrisData.replace("010211", "010212");
  const step2 = step1.split("5802ID");

  const amountStr = String(amount);
  const uang = "54" + String(amountStr.length).padStart(2, "0") + amountStr + "5802ID";

  const result = step2[0] + uang + step2[1];
  const resultWithCRC = result + convertCRC16(result);

  return resultWithCRC;
}

export default generateQRIS