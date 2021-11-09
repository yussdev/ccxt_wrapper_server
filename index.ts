import express from "express";
import * as ccxt from "ccxt";
import type { ExchangeId } from "ccxt";

export interface Action {
  method: "fetchOrders" | "fetchOpenOrders" | "fetchClosedOrders";
  args: string[];
  exchangeName: ExchangeId;
  config: {
    apiKey: string;
    secret: string;
    password?: string;
  };
}

const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.json());

app.post("/", async (req, res) => {
  try {
    const {
      method = "fetchOpenOrders",
      args = [],
      config,
      exchangeName,
    } = req.body as Action;

    const exchange = new ccxt[exchangeName](config);
    const ccxtResponse = await exchange[method](...args);

    return res.json({
      data: ccxtResponse,
    });
  } catch (err: any) {
    res.json({
      error: {
        message: err.message,
      },
    });
  }
});

app.listen(PORT, () => {
  console.log(`ccxt wrapper server is running @ http://localhost:${PORT}`);
});
