import { Suspense, useEffect, useState } from "react";
import CommandPrompt from "../CommandEntry";
import CommandEntry from "../CommandEntry/CommandEntry";

import { ApolloClient, createHttpLink, InMemoryCache, gql } from "@apollo/client";
import { setContext } from '@apollo/client/link/context';
import "./styles.scss";
import Project from "./Project";

export default async function Terminal() {

    const data = await getData()

    return (
        <div id="terminal-body" className="selectable">
            <CommandEntry location={"~"}>cat hello.txt</CommandEntry>
            <p className="subtext">
                Hello there! Welcome to my website where I showcase some of my projects and fun
                ideas. Browse through the files to discover more about my work. If you have any
                questions or just want to chat, feel free to reach out. Enjoy your time here!
            </p>
            <div className="spacer"></div>
            <CommandEntry location={"~"}>cd projects/ && ls.</CommandEntry>
            <div id="projects">
                {data.map((item, _) => (
                    <Project key={item.id} name={item.name} description={item.description} href={item.url} />
                ))}
                <Project name={"Playground"} description={"My space for playing around with web stuff"} href={"https://playground.dinama.dev"} />
            </div>
            <div className="spacer"></div>
            <CommandEntry location={"~/projects"}>cd ..</CommandEntry>
            <CommandEntry location={"~"}>cd socials/ && ls</CommandEntry>
            <div className="socials">
                <a href="https://github.com/Frostplexx" aria-label="GitHub Profile">GitHub</a>
                <a href="mailto:me@dinama.dev" aria-label="Email Address">me@dinama.dev</a>
                <span>Frostplexx.discord</span>
            </div>
            <Suspense fallback={null}>
                <CommandPrompt />
            </Suspense>
        </div>
    );
}

export async function getData() {
    const httpLink = createHttpLink({
        uri: 'https://api.github.com/graphql',
    });

    const authLink = setContext((_, { headers }) => {
        return {
            headers: {
                ...headers,
                authorization: `Bearer ${process.env.GITHUB_ACCESS_TOKEN}`,
            }
        }
    });

    const client = new ApolloClient({
        link: authLink.concat(httpLink),
        cache: new InMemoryCache()
    });


    const { data } = await client.query({
        query: gql`
    {
      user(login: "frostplexx") {
        pinnedItems(first: 6) {
          totalCount
          edges {
            node {
              ... on Repository {
                name
                id
                url
                description
                stargazers {
                  totalCount
                }
              }
            }
          }
        }
      }
    }
  `
    });

    const { user } = data;
    const pinnedItems = user.pinnedItems.edges.map(edge => edge.node);
    return pinnedItems;
}
