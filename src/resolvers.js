import Resolver from "@forge/resolver";
import { defineGetUserInfo } from "./resolvers/getUserInfo";
import { defineSetUserInfo } from "./resolvers/setUserInfo";

export const resolver = new Resolver();

defineGetUserInfo(resolver);
defineSetUserInfo(resolver);

export const handler = resolver.getDefinitions();
