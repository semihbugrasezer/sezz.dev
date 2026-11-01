import { feed } from '../lib/feed';
// Path kept from the previous MkDocs site so existing subscriptions keep working.
export const GET = () => feed('created');
