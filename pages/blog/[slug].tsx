import React from 'react';
import { useGeneralSettings } from '@wpengine/headless/react';
import { usePost } from '@wpengine/headless/next';
import type { GetServerSidePropsContext, GetStaticPropsContext } from 'next';
import {
  getApolloClient,
} from '@wpengine/headless';
import { gql } from '@apollo/client';
import { CTA, Footer, Header, Hero } from '../../components';
import { POST_DATA_FRAGMENT } from '@wpengine/headless/dist/api/queries';

export default function BlogPost({ post }: { post: any }): JSX.Element {
  const settings = useGeneralSettings();

  return (
    <>
      <Header title={ settings?.title } description={ settings?.description } />
      <main className="content content-single">
        { post?.title && <Hero title={ post?.title } /> }
        <div className="wrap">
          { post && (
            <div>
              <div>
                {/* eslint-disable-next-line react/no-danger */ }
                <div dangerouslySetInnerHTML={ { __html: post.content ?? '' } } />
              </div>
            </div>
          ) }
        </div>
        <CTA
          title="Start your headless journey today"
          buttonText="Get Started"
          buttonURL="https://github.com/wpengine/headless-framework/"
          headingLevel="h2">
          <p>
            Learn more in the{ ' ' }
            <a href="https://github.com/wpengine/headless-framework">
              Headless Framework GitHub repository
            </a>
            .
          </p>
        </CTA>
      </main>
      <Footer copyrightHolder={ settings?.title } />
    </>
  );
}

export async function getStaticProps(
  context: GetStaticPropsContext | GetServerSidePropsContext,
) {
  const apollo = getApolloClient(context);

  const post = await apollo.query({
    query: gql`
      ${gql`${POST_DATA_FRAGMENT}`}
      {
        postBy(slug: "${(context.params as {slug: string}).slug}") {
          ...postData
        }
      }
    `
  })

  return { props: { post: post.data.postBy } }
}

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking'
  };
}
