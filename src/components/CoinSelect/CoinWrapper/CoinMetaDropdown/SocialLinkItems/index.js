import React, { memo, useState, useEffect, useRef } from 'react';
import { CaretArrowIcon } from '@/components-generic/ArrowIcon';

import { PaginationWrapper, StageWrapper, ArrowWrapper } from './styles';

import imgIconFacebook from './icon-resource/icon-facebook.svg';
import imgIconTwitter from './icon-resource/icon-twitter.svg';
import imgIconTelegram from './icon-resource/icon-telegram.svg';
import imgIconReddit from './icon-resource/icon-reddit.svg';
import imgIconDiscord from './icon-resource/icon-discord.svg';
import imgIconYoutube from './icon-resource/icon-youtube.svg';
import imgIconInstagram from './icon-resource/icon-instagram.svg';
import imgIconGithub from './icon-resource/icon-github.svg';

const showCounts = 7;

function getSocialLinkItems(socialInfo) {
  const socialLinkItems = [];
  for (let i = 0; i < socialInfo.length; i++) {
    const splitArray = socialInfo[i].split('//');
    const domainArray = splitArray[1].split('/');
    const title = domainArray[0].split('.');

    let toolTip = '';
    if (title.length === 3) {
      toolTip = title[1];
    } else if (title.length === 2) {
      toolTip = title[0];
    }

    let imgSrc = `SocialLinks/${domainArray[0]}.png`;
    if (
      socialInfo[i].indexOf('https://facebook.com') !== -1 ||
      socialInfo[i].indexOf('https://www.facebook.com') !== -1
    ) {
      imgSrc = imgIconFacebook;
    } else if (
      socialInfo[i].indexOf('https://twitter.com') !== -1 ||
      socialInfo[i].indexOf('https://www.twitter.com') !== -1
    ) {
      imgSrc = imgIconTwitter;
    } else if (
      socialInfo[i].indexOf('https://discord.com') !== -1 ||
      socialInfo[i].indexOf('https://www.discord.com') !== -1
    ) {
      imgSrc = imgIconDiscord;
    } else if (
      socialInfo[i].indexOf('https://github.com') !== -1 ||
      socialInfo[i].indexOf('https://www.github.com') !== -1
    ) {
      imgSrc = imgIconGithub;
    } else if (
      socialInfo[i].indexOf('https://telegram.org') !== -1 ||
      socialInfo[i].indexOf('https://www.telegram.org') !== -1
    ) {
      imgSrc = imgIconTelegram;
    } else if (
      socialInfo[i].indexOf('https://reddit.com') !== -1 ||
      socialInfo[i].indexOf('https://www.reddit.com') !== -1
    ) {
      imgSrc = imgIconReddit;
    } else if (
      socialInfo[i].indexOf('https://youtube.com') !== -1 ||
      socialInfo[i].indexOf('https://www.youtube.com') !== -1
    ) {
      imgSrc = imgIconYoutube;
    } else if (
      socialInfo[i].indexOf('https://instagram.com') !== -1 ||
      socialInfo[i].indexOf('https://www.instagram.com') !== -1
    ) {
      imgSrc = imgIconInstagram;
    }

    socialLinkItems.push(
      <a href={socialInfo[i]} target="_blank" rel="noopener noreferrer" aria-label={toolTip} title={toolTip} key={i}>
        <img className="img-icon" alt="" src={imgSrc} />
      </a>
    );
  }

  return socialLinkItems;
}

const IconPagination = memo(({ socialInfo }) => {
  const socialItems = getSocialLinkItems(socialInfo);

  const [curIndex, setCurIndex] = useState(0);
  const currentItems = useRef(socialItems.filter((_, i) => i < showCounts));
  useEffect(() => {
    currentItems.current = socialItems.filter((_, i) => i < showCounts);
    setCurIndex(0);
  }, [socialItems]);

  const adjustIndex = value => {
    currentItems.current = socialItems.filter((e, i) => i >= value && i < showCounts + value);
    setCurIndex(value);
  };
  const slideNext = () => adjustIndex(curIndex + 1);
  const slidePrev = () => adjustIndex(curIndex - 1);

  return (
    <PaginationWrapper>
      {socialItems.length > showCounts ? (
        <>
          <ArrowWrapper>
            {curIndex > 0 ? <CaretArrowIcon degree={90} onClick={slidePrev} /> : <div className="blank-space" />}
          </ArrowWrapper>
          <StageWrapper>
            <div className="carousel-stage">{currentItems.current}</div>
          </StageWrapper>
          <ArrowWrapper>
            {curIndex < socialItems.length % showCounts ? (
              <CaretArrowIcon degree={-90} onClick={slideNext} />
            ) : (
              <div className="blank-space" />
            )}
          </ArrowWrapper>
        </>
      ) : (
        <div className="carousel-stage">{socialItems}</div>
      )}
    </PaginationWrapper>
  );
});

export default IconPagination;
