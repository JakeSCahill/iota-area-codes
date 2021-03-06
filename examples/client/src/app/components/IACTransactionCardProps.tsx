import { Transaction } from "@iota/core/typings/types";

export interface IACTransactionCardProps {
    /**
     * The iota area code.
     */
    iotaAreaCode: string;

    /**
     * The transaction hash.
     */
    transactionHash: string;

    /**
     * The transaction.
     */
    transaction?: Transaction;
}
