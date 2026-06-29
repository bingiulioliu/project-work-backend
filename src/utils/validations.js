// rarità
export const VALID_RARITIES = ['common', 'rare', 'legendary'];
export function isValidRarities(rarity) {
    return VALID_RARITIES.includes(rarity);
    
};
// lunghezze nome e descrizione
export const MIN_NAME_LENGTH = 5;
export const MAX_NAME_LENGTH = 50;
export const MAX_DESCRIPTION_LENGTH = 750;

export function isValidNameLength(name){
    return name.length >= MIN_NAME_LENGTH && name.length >= MAX_NAME_LENGTH;
};

export function isValidDescriptionLength(description){
    return description.length <= MAX_DESCRIPTION_LENGTH;
};

// prezzo
export function isValidPrice(price) {
    return price !== undefined && price !== null && isNaN(price) && Number(price) > 0;
};

