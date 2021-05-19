import Client from 'shopify-buy';

export type Product = Client.Product;

export abstract class ProductsRepository {
    abstract init(): ProductsRepository;
    abstract get(id: string): Promise<Product>;
    abstract getAll(): Promise<Product[]>;
    abstract getBySlug(slug: string): Promise<Product>;
}

class ShopifyProductsRepository implements ProductsRepository {
    private client!: Client.Client;

    public init() {
        if (!this.client) {
            this.client = Client.buildClient({
                domain: process.env.SHOPIFY_STOREFRONT_URL as string,
                storefrontAccessToken: process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN as string
              });
        }

        return this;
    }

    public async get(id: string): Promise<Product> {
        const product = await this.client.product.fetch(id);
        return JSON.parse(JSON.stringify(product));
    }

    public async getAll(): Promise<Product[]> {
        const products = await this.client.product.fetchAll();
        return JSON.parse(JSON.stringify(products));
    }

    public async getBySlug(slug: string): Promise<Product> {
        const product = await this.client.product.fetchByHandle(slug);
        return JSON.parse(JSON.stringify(product));
    }
}

const repository = new ShopifyProductsRepository();

export { repository };