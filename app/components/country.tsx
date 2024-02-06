type CountryCode = string  

type CountryMapping = {
    [key in CountryCode]: string;
}

const countryMappings: CountryMapping = {
    CA: 'Canada 🇨🇦',
    US: 'United States 🇺🇸',
    AU: 'Australia 🇦🇺',
    CN: 'China 🇨🇳',
    TW: 'Taiwan 🇹🇼',
    DE: 'Germany 🇩🇪',
    ES: 'Spain 🇪🇸',
    FR: 'France 🇫🇷',
    GB: 'United Kingdom 🇬🇧',
    HK: 'Hong Kong 🇭🇰',
    ID: 'Indonesia 🇮🇩',
    IE: 'Ireland 🇮🇪',
    IN: 'India 🇮🇳',
    IT: 'Italy 🇮🇹',
    JP: 'Japan 🇯🇵',
    KR: 'South Korea 🇰🇷',
    MX: 'Mexico 🇲🇽',
    MY: 'Malaysia 🇲🇾',
    NZ: 'New Zealand 🇳🇿',
    PH: 'Philippines 🇵🇭',
    RU: 'Russia 🇷🇺',
    SG: 'Singapore 🇸🇬',
    TH: 'Thailand 🇹🇭',
    UA: 'Ukraine 🇺🇦',
    VN: 'Vietnam 🇻🇳',
};

/**
 * Check if the country code is in the dictionary and return the country name and emoji.
 * @param countryCode? string | null | undefined - the country code
 * @returns string | undefined
 */
export default function Country ( countryCode?: string) {
    if (!countryCode) {
        return undefined
    }
    return countryMappings[countryCode]
};


