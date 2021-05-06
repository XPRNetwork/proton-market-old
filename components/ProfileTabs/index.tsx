import { Dispatch, SetStateAction } from 'react';
import { Row, Tab } from './ProfileTabs.styled';

type Tab = {
  title: string;
  type: string;
};

type Props = {
  tabList: Tab[];
  activeTab: string;
  setActiveTab: Dispatch<SetStateAction<string>>;
};

export const ProfileTabs = ({
  tabList,
  activeTab,
  setActiveTab,
}: Props): JSX.Element => {
  return (
    <Row>
      {tabList.map(({ title, type }) => {
        return (
          <Tab
            key={type}
            onClick={() => setActiveTab(type)}
            isActive={activeTab === type}>
            {title}
          </Tab>
        );
      })}
    </Row>
  );
};

export default ProfileTabs;
