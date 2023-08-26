import React from 'react';
import styled from 'styled-components/macro';
import DownloadIcon from './download.svg';

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  background-color: ${props => props.theme.palette.clrMainWindow};
  padding-bottom: 0.5em;
  padding-right: 2em;
  justify-content: flex-end;
`;

const Button = styled.button`
  background-color: #2680ff;
  min-width: 67px;
  height: 25px;
  margin-right: 10px;
  font-size: 12px;
  border: none;
`;

const DefaultButton = styled(Button)`
  color: #fff;
  border: none;
  border-radius: 2px;
  outline-color: white;
  &:hover {
    cursor: pointer;
    color: #fff;
  }
`;

const SearchButton = styled.img`
  padding: 8px;
  height: 40px
    &:hover {
    cursor: pointer;
    background: #747ba6;
    border-radius: 50%;
  }
`;

const Input = styled.input`
  border: 1px solid #454c73;
  border-radius: 2px;
  height: 25px;
  font-size: 12px;
  background-color: ${props => props.theme.palette.clrDarkPurple};
  color: #fff;
  margin-right: 10px;
  max-width: 100px;
  padding: 0 5px;
  outline-color: white;
  &::placeholder {
    color: ${props => props.theme.palette.clrPurple};
  }
`;

const SearchInput = styled(Input)`
  max-width: 140px;
`;

const SearchWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-left: 15px;
`;

const Separator = styled.div`
  display: inline-block;
  position: relative;
  width: 10px;
  height: 1px;
  margin-right: 10px;

  &:after {
    content: '';
    display: block;
    width: 9px;
    height: 1px;
    border-bottom: 1px solid #454c73;
    position: absolute;
    margin: auto;
    top: 0;
    left: 0;
    right: 0;
  }
`;

const DownloadImg = styled.img`
  padding: 8px;
`;

const RightWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-right: 10px;

  .file-upload {
    display: flex;
    cursor: pointer;
    width: 35px;
    height: 35px;
    justify-content: center;
    align-items: center;

    &:hover {
      background: #747ba6;
      border-radius: 50%;
    }

    input[type='file'] {
      display: none;
    }
  }
`;

class SubHeader extends React.Component {
  openImageUpload = () => {
    return this.uploadRef.click();
  };

  render() {
    const { tab } = this.props;

    return (
      <Wrapper>
        <div>
          <SearchWrapper>
            {(tab === 'orderHistory' || tab === 'tradeHistory') && (
              <>
                {tab === 'tradeHistory' && <Input placeholder="Client ID" />}
                <Input placeholder="Order ID" />
                {/* <Input placeholder="Client Order ID"/> */}
              </>
            )}
            {tab === 'paymentHistory' && (
              <>
                <Input placeholder="Amount from" />
                <Separator />
                <Input placeholder="Amount to" />
                <SearchInput placeholder="Search" />
              </>
            )}
            {tab === 'navReport' ? (
              <DefaultButton>Generate</DefaultButton>
            ) : (
              <SearchButton src="/img/svg/search_icon.svg" alt="Search" />
            )}
            {/* <ResetButton>Reset</ResetButton> */}
          </SearchWrapper>
        </div>

        <RightWrapper>
          {/* <DropMenu
                        data={fileFormatList}
                    /> */}
          <div className="file-upload" onClick={this.openImageUpload} role="button" tabIndex={0}>
            <DownloadImg src={DownloadIcon} alt="Download" />
            <input type="file" ref={ref => (this.uploadRef = ref)} />
          </div>
        </RightWrapper>
      </Wrapper>
    );
  }
}

export default SubHeader;
