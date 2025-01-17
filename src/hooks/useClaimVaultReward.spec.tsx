import { fireEvent, waitFor } from '@testing-library/react';
import React from 'react';

import fakeAccountAddress from '__mocks__/models/address';
import { claimVaiVaultReward, claimVrtVaultReward, claimXvsVaultReward } from 'clients/api';
import { TOKENS } from 'constants/tokens';
import renderComponent from 'testUtils/renderComponent';

import useClaimVaultReward from './useClaimVaultReward';

jest.mock('clients/api');

const fakeClaimRewardButtonLabel = 'Claim reward';

describe('hooks/useClaimVaultReward', () => {
  it('calls claimXvsVaultReward with correct parameters when calling stake a poolIndex', async () => {
    const fakePoolIndex = 6;

    const TestComponent: React.FC = () => {
      const { claimReward } = useClaimVaultReward();

      return (
        <>
          <button
            onClick={() =>
              claimReward({
                stakedTokenId: TOKENS.vai.id,
                rewardTokenId: TOKENS.xvs.id,
                accountAddress: fakeAccountAddress,
                poolIndex: fakePoolIndex,
              })
            }
            type="button"
          >
            {fakeClaimRewardButtonLabel}
          </button>
        </>
      );
    };

    const { getByText } = renderComponent(<TestComponent />);

    // Click on claim reward button
    fireEvent.click(getByText(fakeClaimRewardButtonLabel));

    await waitFor(() => expect(claimXvsVaultReward).toHaveBeenCalledTimes(1));
    expect(claimXvsVaultReward).toHaveBeenCalledWith({
      fromAccountAddress: fakeAccountAddress,
      poolIndex: fakePoolIndex,
      rewardTokenAddress: TOKENS.xvs.address,
    });
  });

  it('calls claimVaiVaultReward with correct parameters when calling stake without a poolIndex and stakedTokenId is equal to "vai"', async () => {
    const TestComponent: React.FC = () => {
      const { claimReward } = useClaimVaultReward();

      return (
        <>
          <button
            onClick={() =>
              claimReward({
                stakedTokenId: TOKENS.vai.id,
                rewardTokenId: TOKENS.xvs.id,
                accountAddress: fakeAccountAddress,
              })
            }
            type="button"
          >
            {fakeClaimRewardButtonLabel}
          </button>
        </>
      );
    };

    const { getByText } = renderComponent(<TestComponent />);

    // Click on claim reward button
    fireEvent.click(getByText(fakeClaimRewardButtonLabel));

    await waitFor(() => expect(claimVaiVaultReward).toHaveBeenCalledTimes(1));
    expect(claimVaiVaultReward).toHaveBeenCalledWith({
      fromAccountAddress: fakeAccountAddress,
    });
  });

  it('calls claimVrtVaultReward with correct parameters when calling stake without a poolIndex and stakedTokenId is equal to "vrt"', async () => {
    const TestComponent: React.FC = () => {
      const { claimReward } = useClaimVaultReward();

      return (
        <>
          <button
            onClick={() =>
              claimReward({
                stakedTokenId: TOKENS.vrt.id,
                rewardTokenId: TOKENS.xvs.id,
                accountAddress: fakeAccountAddress,
              })
            }
            type="button"
          >
            {fakeClaimRewardButtonLabel}
          </button>
        </>
      );
    };

    const { getByText } = renderComponent(<TestComponent />);

    // Click on claim reward button
    fireEvent.click(getByText(fakeClaimRewardButtonLabel));

    await waitFor(() => expect(claimVrtVaultReward).toHaveBeenCalledTimes(1));
    expect(claimVrtVaultReward).toHaveBeenCalledWith({
      fromAccountAddress: fakeAccountAddress,
    });
  });
});
