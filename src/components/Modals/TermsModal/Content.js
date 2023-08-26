import React from 'react';
import ReactMarkdown from 'react-markdown';
import DataLoader from '@/components-generic/DataLoader';
import { ContentOuterWrapper, ContentInnerWrapper, TextDescription } from './styles';

const Content = ({ text, isLoading }) => (
  <ContentOuterWrapper>
    <ContentInnerWrapper>
      {isLoading ? (
        <DataLoader width="50" height="50" />
      ) : (
        <TextDescription>
          <ReactMarkdown source={text} />
        </TextDescription>
      )}
    </ContentInnerWrapper>
  </ContentOuterWrapper>
);

export default Content;
