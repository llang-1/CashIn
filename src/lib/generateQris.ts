import convertCRC16 from "@/lib/convertCRC";

function generateQRIS(amount) {
  const baseData = ""; // supayaa bisa mendapatkan data qris dengan cara berikut. 1. upload qris kamuu ke google lens 2. lalu bisa melihat data qris kayak gini: 00020101021126670016COM.NOBUBANK.WWW0118936005030000087914021414204... dan seterusnya.
  const qrisData = baseData.slice(0, -4);

  const step1 = qrisData.replace("010211", "010212");
  const step2 = step1.split("5802ID");

  const amountStr = String(amount);
  const uang = "54" + String(amountStr.length).padStart(2, "0") + amountStr + "5802ID";

  const result = step2[0] + uang + step2[1];
  const resultWithCRC = result + convertCRC16(result);

  return resultWithCRC;
}