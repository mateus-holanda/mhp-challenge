# MHP Challenge

## Prerequisites

This project is built in a monorepo format. It uses Yarn 2 workspaces. The rest of this document assumes you have installed Docker and [asdf](https://asdf-vm.com/guide/getting-started.html) along with the node (`asdf plugin-add nodejs`) asdf plugin. 
> [!Note]
> We suggest you use [Docker Desktop](https://www.docker.com/products/docker-desktop/) if you are new to containers. Docker is used to to run our Postgres and Redis dependencies but not to run our API, UI, or Lambda Engine

Install our favored tool versions with:
```bash
$ asdf install
```

Enable corepack:
```bash
$ corepack enable
```

Reshim Node:
```bash
$ asdf reshim nodejs
```

## Getting Started

### Environment Setup

Before getting started with development do:
```bash
# install dependencies
$ yarn
# initialize dev environment
$ yarn init-dev
```

This will setup the `.env` files within the `api` and `ui` projects.
> [!IMPORTANT]  
> You will need to update your `.env` files with the secret environment variable values shown in `.env.example`

## Running the Application

### Running the API

Start the API development server from the project root:

```bash
$ yarn workspace @mhp/api dev
```

### Running the UI

Start the UI development server from the project root:

```bash
$ yarn workspace @mhp/ui dev
```

## Adding Dependencies

When adding new dependencies to a project:

```bash
$ yarn workspace @mhp/[app-name] add [package-name]
```

## Areas for Improvement (Not Implemented Due to Time Constraints):

1. In addition to comparing the average income of the county where the user is located, it is also possible to evaluate income at the state and federal levels, justifying the use of bar charts for this type of visualization.
2. The browser should automatically detect the user's location (at the county level) to perform the evaluation without requiring manual input selection
3. Use of local storage to store previously requested location data, preventing unnecessary API calls to Census.gov and the application's own API. This would improve scalability and response time. Since this type of data takes a long time to update, a considerable expiration period (e.g., 1 to 3 months) could be set before requiring a new request to the backend
4. Implement a search bar attached to the selectors, allowing users to quickly find and select their state and county
5. Implement a detailed interactive map of the United States at the county level, enabling users to visually select their location instead of using a selector. Surely there are several libraries available for this purpose, such as [react-simple-maps](https://www.react-simple-maps.io/) or [react-usa-map](https://www.npmjs.com/package/react-usa-map)
6. End-to-end testing using Cypress
7. Better setup of Tailwind variables and the addition of utility classes to improve component styling performance