import styled from '@emotion/styled';
import { Button } from 'antd';

import { TST } from '../types/tst.type';

const SoftButton = styled(Button)<TST>`
  background-color: ${({ token }) => token.colorPrimary}25;
  color: ${({ token }) => token.colorPrimary};
`;

export default SoftButton;
