/** @jsxImportSource @emotion/react */
import BigNumber from 'bignumber.js';
import { VError } from 'errors';
import React, { useContext } from 'react';
import { useTranslation } from 'translation';
import type { TransactionReceipt } from 'web3-core/types';

import { useClaimXvsReward, useGetXvsReward } from 'clients/api';
import { TOKENS } from 'constants/tokens';
import { AuthContext } from 'context/AuthContext';
import { DisableLunaUstWarningContext } from 'context/DisableLunaUstWarning';
import useConvertWeiToReadableTokenString from 'hooks/useConvertWeiToReadableTokenString';
import useHandleTransactionMutation from 'hooks/useHandleTransactionMutation';

import { ButtonProps, SecondaryButton } from '../../Button';
import { TokenIcon } from '../../TokenIcon';
import TEST_IDS from '../testIds';
import { useStyles } from './styles';

export interface ClaimXvsRewardButtonProps extends Omit<ButtonProps, 'onClick'> {
  onClaimReward: () => Promise<TransactionReceipt | void>;
  amountWei?: BigNumber;
}

export const ClaimXvsRewardButtonUi: React.FC<ClaimXvsRewardButtonProps> = ({
  amountWei,
  onClaimReward,
  ...otherProps
}) => {
  const { t, Trans } = useTranslation();
  const styles = useStyles();

  const handleTransactionMutation = useHandleTransactionMutation();

  const readableAmount = useConvertWeiToReadableTokenString({
    valueWei: amountWei,
    token: TOKENS.xvs,
    minimizeDecimals: true,
  });

  // Check readable amount isn't 0 (since we strip out decimals)
  if (!amountWei || readableAmount.split(' ')[0] === '0') {
    return null;
  }

  const handleClick = () =>
    handleTransactionMutation({
      mutate: onClaimReward,
      successTransactionModalProps: transactionReceipt => ({
        title: t('claimXvsRewardButton.successfulTransactionModal.title'),
        content: t('claimXvsRewardButton.successfulTransactionModal.message'),
        amount: {
          valueWei: amountWei,
          token: TOKENS.xvs,
        },
        transactionHash: transactionReceipt.transactionHash,
      }),
    });

  return (
    <SecondaryButton
      data-testid={TEST_IDS.claimXvsRewardButton}
      css={styles.button}
      onClick={handleClick}
      {...otherProps}
    >
      <Trans
        i18nKey="claimXvsRewardButton.title"
        components={{
          Icon: <TokenIcon token={TOKENS.xvs} css={styles.icon} />,
        }}
        values={{
          amount: readableAmount,
        }}
      />
    </SecondaryButton>
  );
};

export const ClaimXvsRewardButton: React.FC<ButtonProps> = props => {
  const { account } = useContext(AuthContext);

  const { hasLunaOrUstCollateralEnabled, openLunaUstWarningModal } = useContext(
    DisableLunaUstWarningContext,
  );

  const { data: xvsRewardData } = useGetXvsReward(
    {
      accountAddress: account?.address || '',
    },
    {
      enabled: !!account?.address,
    },
  );

  const { mutateAsync: claimXvsReward, isLoading: isClaimXvsRewardLoading } = useClaimXvsReward();

  const handleClaim = async () => {
    if (!account?.address) {
      throw new VError({ type: 'unexpected', code: 'walletNotConnected' });
    }

    // Block action is user has LUNA or UST enabled as collateral
    if (hasLunaOrUstCollateralEnabled) {
      openLunaUstWarningModal();
      return;
    }

    return claimXvsReward({
      fromAccountAddress: account.address,
    });
  };

  return (
    <ClaimXvsRewardButtonUi
      amountWei={xvsRewardData?.xvsRewardWei}
      loading={isClaimXvsRewardLoading}
      onClaimReward={handleClaim}
      {...props}
    />
  );
};

export default ClaimXvsRewardButton;
