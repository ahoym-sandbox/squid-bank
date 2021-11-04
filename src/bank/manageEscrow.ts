import { xrplClient } from "../XrplApiSandbox";

function fromHex(hex: string) {
  var str = "";
  for (var n = 0; n < hex.length; n += 2) {
    str += String.fromCharCode(parseInt(hex.substr(n, 2), 16));
  }
  return str;
}

export function parseEscrowDataFromMemos(memos: any) {
  var addr: any;
  var condition: any;
  var fulfilment: any;
  var message: any;
  memos.forEach((m: any, idx: any) => {
    var value = fromHex(m.Memo.MemoData.toString());
    var type = fromHex(m.Memo.MemoType.toString());

    if (type === "nft/0") {
      addr = value;
    }
    if (type === "nft/1") {
      condition = value;
    }
    if (type === "nft/2") {
      fulfilment = value;
    }
    if (type === "nft/3") {
      message = value;
    }
  });

  return {
    playerAddress: addr,
    condition: condition,
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
