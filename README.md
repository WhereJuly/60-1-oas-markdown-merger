<div align="center">
  <img src="./.docs/banner.jpg" width="100%"/>
</div>

# The OpenAPI Design-by-Contract Suite

<small>`#typescript` `#nodejs` `#openapi` `#contract` `#backend` `#front-end` `#documentation`</small>

**Contents**

- [Design by Contract](#design-by-contract)
  - [The Suite Place in **DbC** Context](#the-suite-place-in-dbc-context)
- [The Basic Motivation](#the-basic-motivation)
- [The Goal](#the-goal)
- [The Big Picture](#the-big-picture)
- [The Packages](#the-packages)
- [Operations](#operations)
  - [Development](#development)
    - [Tooling](#tooling)
    - [The Repository Structure](#the-repository-structure)
  - [CI/CD](#cicd)
    - [Composed Git Workflows](#composed-git-workflows)

## Design by Contract

**IMPORTANT**: The Suite provides the tools to implement [Design-by-Contract](https://en.wikipedia.org/wiki/Design_by_contract) (**DbC**, [^1]) along the entire workflow of a software product creation.

### The Suite Place in **DbC** Context

Here is the entire context the Suite packages operate in.

- External to the Suite, initially **DbC** starts at requirements formalization and arrives at the concrete Contract definitions. Since the first definitions created the Contract becomes the single source of truth.

- Then **DbC** gets to alternate the Contract definitions and implementation phases. The implementation phase clarifies product requirements that in turn drives Contract definitions to change. Then the cycle  repeats until the Contract stabilizes.

- Since the first Contract definitions version **DbC** uses OpenAPI to document the concrete Contract. The Contract should be communicated among stakeholders in a human-readable form e.g. a contract documentation webs sites to ensure product quality.

- On implementation phases **DbC** has to provided the Contracts automated enforcement onto various parts of the software product (backends, front-ends) to build the product quality into implementation.

**The Suite Scope**

The scope of the Suits is two last domains - Contract documentation websites adn Contract enforcement tools.

## The Basic Motivation

Initially I needed the versatile and flexible OpenAPI documentation website tool that could be modular and easily adaptable to show the concrete OpenAPI contracts in a human-readable form. I.e. a website.

The existing solutions were either not flexible enough to adopt my functional and visual design requirements or paid.

Starting from that idea I am on the way to create better solution as I see it.

## The Goal

> TBW. this is just a draft. it will show itself with the time.

The packages in the repository aim to provide tools to implement Design-by-Contract in NodeJS/TypeScript environments.

- Create contracts: external packages to be used; Not sure if I have to describe it further here or at all;
- Use contracts: OAS Contract Adapters: generic, contract outlet (with generator);
- Present: OAS Contract Looks;

## The Big Picture

> TBW. this is just a draft. it will show itself with the time.

Contract Outlet Adapter is used as a standalone package in the Concrete contract definition repositories. It should be provided with OAS JSON definitions to generated the Concrete Contract Outlet adapter. The generated adapter then is imported in the backend or front-ends like Fastify or Vue applications.

The Concrete Contract Outlet adapter is used in backends to create the endpoints (taking verbs, routes) and validate request and response. On front-ends the Outlet is used to organize the inputs validation with packages like `ajv`.

<div align="center">
  <img src="./.docs/bigger-picture-actual.svg" width="70%"/>
</div>

[^1]: For people new to DbC approach on top of the above mentioned [wiki](https://en.wikipedia.org/wiki/Design_by_contract) link here are some useful links to start from. Stoplight Blog [API-First vs. API Design-First: A Comprehensive Guide](https://blog.stoplight.io/api-first-vs-api-design-first-a-comprehensive-guide), Contract-First Development Internet search [results](https://duckduckgo.com/?q=Contract-First+Development).

## The Packages

- [Generic OAS Adapter](packages/adapters/generic);
- [Contract Outlet Adapter](packages/adapters/outlet);
- [Looks Theme](packages/looks);
- [Looks Adapter](packages/looks);

So far Looks Adapter and Looks Theme are under implicit development as the entire Looks package. They will be extracted into the dedicated packages as soon as they reveal themselves.

## Operations

### Development

<a href="https://coggle.it/diagram/ZzrasnH5wJ7yTWod/t/oas/37c1aa8d2048f33deaada3bf2dba0cf80cd8137497bd005b025507e8ce35a2a9">
  <div>Development Plan Overview</div>
  <img src="./.docs/coggle.png" width="30%">
</a>

#### Tooling

TypeScript, NodeJS, Vitest.

#### The Repository Structure

The repository is a monorepo (using `npm workspaces`) with independent packages deployment.

The monorepo root only serves as the common packages and scripts storage as well as centralized documentation (where appropriate) and GitHub side matters (issues, projects, merges etc.).

Each actual package is developed, built and deployed independently. When the monorepo package depends on its siblings it manages the dependency on its own.

### CI/CD

The process enforces quality via automated tests, commit messages rules, release rules and IaC scripts.

#### Composed Git Workflows

The packages within Suite with the time will implement my [Composed Git Workflow](https://github.com/progressing-explorations/shared/tree/master/composed-git-workflows#composed-git-workflows).

Specifically it will include the daily development management and release management.
