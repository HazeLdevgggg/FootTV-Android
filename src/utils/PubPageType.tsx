type PubBanner = {
    id: string;
    width: number;
    height: number;
};

type PubSection = {
    display: number;
    banner: PubBanner;
};

type PubPage = {
    top: PubSection;
    middle: PubSection;
    footer: PubSection;
};

export type { PubPage };
