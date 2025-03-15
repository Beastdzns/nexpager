import { useNavigate } from "react-router-dom";
import {
    ConnectWallet,
    Wallet,
    WalletDropdown,
    WalletDropdownDisconnect,
  } from '@coinbase/onchainkit/wallet';
  import {
    Address,
    Avatar,
    Name,
    Identity,
  } from '@coinbase/onchainkit/identity';
  import { color } from '@coinbase/onchainkit/theme';

const Onchain: React.FC = () => {
    const navigate = useNavigate();
    return (
        <div className="flex justify-center items-center min-h-screen border-solid rounded-lg text-2xl">
      <Wallet>
        <ConnectWallet onConnect={() => navigate('/verify')}>
          <Avatar className="h-6 w-6" />
          <Name />
        </ConnectWallet>
        <WalletDropdown>
          <Identity className="px-4 pt-3 pb-2" hasCopyAddressOnClick>
            <Avatar />
            <Name />
            <Address className={color.foreground} />
          </Identity>
          <WalletDropdownDisconnect />
        </WalletDropdown>
      </Wallet>
    </div>
    );
}

export default Onchain;