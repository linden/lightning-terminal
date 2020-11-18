import React from 'react';
import { observer } from 'mobx-react-lite';
import { usePrefixedTranslation } from 'hooks';
import { useStore } from 'store';
import { Badge, Button, HeaderFour, SummaryItem } from 'components/base';
import Tip from 'components/common/Tip';
import Unit from 'components/common/Unit';
import { styled } from 'components/theme';

const Styled = {
  Expires: styled.span<{ warn: boolean }>`
    float: right;
    text-transform: none;

    ${props => props.warn && `color: ${props.theme.colors.gold}`}
  `,
  Summary: styled.div`
    margin: 20px 0 30px;
  `,
  StatusBadge: styled(Badge)<{ pending?: boolean }>`
    color: ${props =>
      props.pending ? props.theme.colors.gold : props.theme.colors.green};
    border-color: ${props =>
      props.pending ? props.theme.colors.gold : props.theme.colors.green};
    font-family: ${props => props.theme.fonts.open.regular};
  `,
  CopyButton: styled(Button)`
    padding: 0;
  `,
  Actions: styled.div`
    margin: 30px auto;
    text-align: center;
  `,
  ExpiresSoon: styled.p`
    font-size: ${props => props.theme.sizes.xs};
  `,
};

const AccountSummary: React.FC = () => {
  const { l } = usePrefixedTranslation('cmps.pool.account.AccountSummary');
  const { orderStore, accountStore, accountSectionView } = useStore();
  const account = accountStore.activeAccount;

  const { Expires, Summary, StatusBadge, CopyButton, Actions, ExpiresSoon } = Styled;
  return (
    <>
      <HeaderFour>
        {l('account')}
        {account.expiresInLabel && (
          <Expires warn={account.expiresSoon}>
            <Tip
              overlay={l('expiresHeight', {
                height: account.expirationHeight,
                remaining: account.expiresInBlocks,
              })}
            >
              <span>
                {l('expiresIn')} {account.expiresInLabel}
              </span>
            </Tip>
          </Expires>
        )}
      </HeaderFour>
      <Summary>
        <SummaryItem strong>
          <span>{l('accountStatus')}</span>
          <StatusBadge pending={account.isPending}>{account.stateLabel}</StatusBadge>
        </SummaryItem>
        <SummaryItem>
          <span>{l('fundingTxn')}</span>
          <CopyButton ghost borderless compact onClick={accountStore.copyTxnId}>
            {account.fundingTxnIdEllipsed}
          </CopyButton>
        </SummaryItem>
        <SummaryItem>
          <span>{l('currentBalance')}</span>
          <Unit sats={account.totalBalance} />
        </SummaryItem>
        <SummaryItem>
          <span>{l('openOrdersCount')}</span>
          <span>{orderStore.pendingOrdersCount}</span>
        </SummaryItem>
        <SummaryItem>
          <span>{l('pendingBalance')}</span>
          <Unit sats={account.pendingBalance} />
        </SummaryItem>
        <SummaryItem strong>
          <span>{l('availableBalance')}</span>
          <span>
            <Unit sats={account.availableBalance} />
          </span>
        </SummaryItem>
      </Summary>
      <Actions>
        {account.expiresSoon && account.stateLabel === 'Open' ? (
          <>
            <ExpiresSoon>{l('expiresSoon')}</ExpiresSoon>
            <Button
              danger
              ghost
              disabled={account.stateLabel !== 'Open'}
              onClick={accountSectionView.showCloseAccount}
            >
              {l('close')}
            </Button>
          </>
        ) : (
          <Button
            primary
            ghost
            disabled={account.stateLabel !== 'Open'}
            onClick={accountSectionView.showFundAccount}
          >
            {l('fundAccount')}
          </Button>
        )}
      </Actions>
    </>
  );
};

export default observer(AccountSummary);
