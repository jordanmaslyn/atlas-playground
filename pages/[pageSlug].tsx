import React from 'react';
import { useGeneralSettings } from '@wpengine/headless/react';
import { usePost } from '@wpengine/headless/next';
import type { GetServerSidePropsContext, GetStaticPropsContext } from 'next';
import {
  getApolloClient,
} from '@wpengine/headless';
import { gql } from '@apollo/client';
import { Footer, Header, Hero } from '../components';
import { PAGE_DATA_FRAGMENT } from '@wpengine/headless/dist/api/queries';

export default function BlogPost({ page }): JSX.Element {
  const settings = useGeneralSettings();

  return (
    <>
      <Header title={settings?.title} description={settings?.description} />
      <main className="content content-page">
        {page?.title && <Hero title={page?.title} />}
        <div className="wrap">
          {page && (
            <div>
              <div>
                {/* eslint-disable-next-line react/no-danger */}
                <div dangerouslySetInnerHTML={{ __html: page.content ?? '' }} />
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer copyrightHolder={settings?.title} />
    </>
  );
}

export async function getStaticProps(
  context: GetStaticPropsContext | GetServerSidePropsContext,
) {
  const apollo = getApolloClient(context);

  const page = await apollo.query({
    query: gql`
      ${gql`${PAGE_DATA_FRAGMENT}`}
      {
        pageBy(uri: "${(context.params as {pageSlug: string}).pageSlug}") {
          ...pageData
        }
      }
    `
  })

  return { props: { page: page.data.pageBy } }
}

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking'
  };
}
