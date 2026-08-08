import { NextRequest, NextResponse } from "next/server";
import { checkPolicyCompliance } from "@/lib/db/policies"; // Database connector
import { algodClient } from "@/lib/algorand/config"; // Algorand SDK configuration

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { agentId, targetEndpoint, txId } = body;

    // 1. Cross-reference the request against PostgreSQL corporate policies
    const isPolicyValid = await checkPolicyCompliance(agentId, targetEndpoint);
    if (!isPolicyValid) {
      return NextResponse.json(
        { error: "Policy Enforcer: AI Agent has exceeded its authorized corporate budget." },
        { status: 403 } // Forbidden by company policy
      );
    }

    // 2. Step One of x402 Spec: If no transaction ID is provided, issue the 402 challenge
    if (!txId) {
      return NextResponse.json(
        {
          error: "Payment Required",
          priceInAlgo: "0.005000",
          destinationWallet: process.env.NEXT_PUBLIC_MERCHANT_WALLET,
          network: "Algorand Arc Testnet",
          nonce: Math.random().toString(36).substring(7),
          instructions: "Sign a 0.005 ALGO transfer and retry including the 'txId' in your request header or payload."
        },
        { status: 402 } // HTTP 402 Payment Required
      );
    }

    // 3. Step Two of x402 Spec: If a txId is provided, perform live on-chain verification
    // Fetch transaction info directly from the Algorand Node
    const txInfo = await algodClient.pendingTransactionInformation(txId).do();
    const confirmedRound = txInfo["confirmed-round"];

    if (!confirmedRound) {
      return NextResponse.json(
        { error: "Payment verification pending. Awaiting Algorand block finality." },
        { status: 202 } // Accepted but processing
      );
    }

    // 4. Verification successful: Securely release data payload
    return NextResponse.json({
      status: "200 OK",
      paymentProof: txId,
      algorandBlockRound: confirmedRound,
      data: {
        message: "Secure data unlocked. Algorand transaction confirmed with instant finality.",
        payload: { marketVelocity: "1603.83 ALGO/hr", activeAgents: 38 }
      }
    });

  } catch (error) {
    return NextResponse.json({ error: "On-chain verification failed." }, { status: 500 });
  }
}
