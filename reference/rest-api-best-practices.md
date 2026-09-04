# 10 REST API BEST PRACTICES

## 1. VERSIONING

- ship breaking changes without breaking everyone already live.
- v1/users -> v2/users

## 2. RATE LIMITING

- protects the API from one client accidentally taking it down
- client -> X requests per second (429 if too fast or too many requests)

### Types of Rate Limiting

#### IP-based Rate Limiting

- limit based on the client's IP address.
- effective for open APIs where clients do not authenticate.
- ineffective for APIs that serve multiple clients through a single NAT gateway (e.g., corporate networks, proxies).

#### User-based Rate Limiting

- limit based on user tokens or authenticated users.
- ideal for authenticated APIs where each user has a unique identity.
- requires proper authentication and session management.

#### API Key-based Rate Limiting

- limit based on API keys provided by clients.
- flexible for different tiers of service (e.g., free, premium, enterprise tiers).
- allows clients to be identified and managed individually.

#### Combined Rate Limiting

- combine multiple strategies for optimal protection.
- e.g., IP-based for unauthenticated requests and user/API-key based for authenticated requests.
- ensures comprehensive protection across all client types.

## 3. HATEOAS (Hypermedia as the Engine of Application State)

- The response tells you what you can do next, not just the data.
- Response -> Links to next action or endpoints

```json
{
  "id": 100,
  "name": "Test Order",
  "price": 20,
  "_links": {
    "self": { "href": "/orders/100" },
    "customer": { "href": "/customers/1" },
    "cancel": { "href": "/orders/100/cancel" },
    "pay": { "href": "/orders/100/pay" }
  }
}
```

- Response tells what the clients can do next, not just the data.

## 4. PAGINATION

- instead of returning all data, return a subset of data with links to the next page
- 1M rows -> 20 per page

```json
{
  "items": [
    {
      "id": 1,
      "name": "Test Product 1"
    },
    {
      "id": 2,
      "name": "Test Product 2"
    }
  ],
  "_links": {
    "self": {
      "href": "/products?page=1&limit=2"
    },
    "next": {
      "href": "/products?page=2&limit=2"
    },
    "last": {
      "href": "/products?page=500000&limit=2"
    }
  },
  "metadata": {
    "page": 1,
    "limit": 2,
    "total": 1000000
  }
}
```

### Types of Pagination

#### Offset-based Pagination

- uses `OFFSET` and `LIMIT` to retrieve data
- simple to implement
- inefficient for large datasets (poor performance for deep pages)
  - e.g., /products?page=100000&limit=10
  -

#### Cursor-based Pagination

- Encapsulates the keyset pointer values into an encoded, opaque string token (the cursor).
- Inherits all the performance and infinite scrolling benefits of keyset pagination.
- Advantage over Keyset: Provides API abstraction. The client treats the cursor as a black box, allowing the backend to change sorting logic without breaking the API contract.
- Limitation: Does not allow jumping to arbitrary pages or calculating total pages.

```json
{
  "items": [
    {
      "id": 1,
      "name": "Test Product 1"
    },
    {
      "id": 2,
      "name": "Test Product 2"
    }
  ],
  "_links": {
    "self": {
      "href": "/products?limit=2"
    },
    "next": {
      "href": "/products?cursor=ZXlKcGJDSTZNaXdpWTNKbFlYUmxaRjlkaGRHbWFXNW5Jam9pTWpBeU5pMHdPQzF5T0RndE1UQXdPakExT2pBd2ZRPQ==&limit=2"
    }
  },
  "metadata": {
    "next_cursor": "ZXlKcGJDSTZNaXdpWTNKbFlYUmxaRjlkaGRHbWFXNW5Jam9pTWpBeU5pMHdPQzF5T0RndE1UQXdPakExT2pBd2ZRPQ==",
    "limit": 2,
    "has_more": true
  }
}
```

#### Keyset Pagination

- Uses the explicit database values (keys) of the last retrieved item to fetch the next page.
- Highly efficient for large datasets because it leverages database indexes directly.
- Limitation: Tightly couples the client to the specific database columns used for sorting.
- Limitation: Does not allow jumping to arbitrary pages because it requires the context of the previous page's data.

```json
{
  "items": [
    {
      "id": 1,
      "name": "Test Product 1",
      "created_at": "2026-08-18T10:00:00Z"
    },
    {
      "id": 2,
      "name": "Test Product 2",
      "created_at": "2026-08-18T10:05:00Z"
    }
  ],
  "_links": {
    "self": {
      "href": "/products?limit=2"
    },
    "next": {
      "href": "/products?last_id=2&last_created_at=2026-08-18T10:05:00Z&limit=2"
    }
  },
  "metadata": {
    "limit": 2,
    "has_more": true
  }
}
```

## 5. Idempotency Keys

- Ensures that an operation can be applied multiple times without changing the result beyond the initial application.
- Retry Same Request -> Process Once
- Retry returns the same reponse
- a network retry should never double-change anyone.

## 6.Meaningful Status Codes

- 200 for everything -> Code matches reality
- a 200 with an error burried the body helps nobody

## 7. Filtering and Sorting

- Full Collection -> ?status=active -> exact slice
- Lets the client ask for a slice, not filter a firehose client-side.

## 8. Consistent Naming

- getUsers / user_list -> /users everywhere
- One convention, uses everywhere, beats a clever one used once.

## 9. Auth in Headers

- Token should be stored in headers not in body
- Use Bearer token for JWT

```http
Authorization: Bearer <token>
```

## 10. Error Envelopes

- Bare Error Strings -> Structured Error Body
- A consistent Error Shape means client can actually handle it.
