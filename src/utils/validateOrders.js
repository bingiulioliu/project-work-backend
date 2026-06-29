// Campi validi
const REQUIRED_CUSTOMER_FIELDS = [
    'customer_name',
    'customer_address',
    'customer_city',
    'customer_postal_code',
    'telephone_number',
    'mail'
];

export function hasRequiredCustomerFields(body){
    return REQUIRED_CUSTOMER_FIELDS.every((field) => Boolean(body[field]));
};

export function isNotEmptyCart(products){
    return Array.isArray(products) && products.length > 0;
};

export function findInvalidCartItem(products){
    return products.find((product) =>
    !product.product_id || !product.quantity || Number(product.quantity) <= 0);
}