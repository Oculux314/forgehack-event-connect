import Resolver from "@forge/resolver";
import { defineGetUserInfo } from "./resolvers/getUserInfo";
import { defineSetUserInfo } from "./resolvers/setUserInfo";
import { defineGetEventInfo } from "./resolvers/getEventInfo";
import { defineSetEventInfo } from "./resolvers/setEventInfo";

export const resolver = new Resolver();

defineGetUserInfo(resolver);
defineSetUserInfo(resolver);
defineGetEventInfo(resolver);
defineSetEventInfo(resolver);

export const handler = resolver.getDefinitions();
