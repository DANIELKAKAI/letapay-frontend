export type PaymentType = {
    payment_id: string;
    sender_address: string;
    receiver_address: string;
    amount: number;
    payment_datetime: string;
    status: string;
    payment_type: string;
}