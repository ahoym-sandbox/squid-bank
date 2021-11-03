import { xrplClient } from "../XrplApiSandbox";

// ASCII only
function toHex(s: string) {
  return s
    .split("")
    .map((c) => {
      return ("0" + c.charCodeAt(0).toString(16)).slice(-2);
    })
    .join("")
    .toUpperCase();
}

function fromHex(hex: string) {
  var str = "";
  for (var n = 0; n < hex.length; n += 2) {
    str += String.fromCharCode(parseInt(hex.substr(n, 2), 16));
  }
  return str;
}

export function parseEscrowDataFromMemos(memos: any) {
  console.log(memos);
  return {
    playerAddress: fromHex(memos[0].Memo.MemoData),
    condition: fromHex(memos[1].Memo.MemoData),
  };
}

export function createConditionalEscrow(
  potAmount: number,
  receiverAddress: string,
  condition: string
) {
  return xrplClient.createConditionalEscrow(
    potAmount,
    receiverAddress,
    condition
  );
}
