import { memo, Dispatch, SetStateAction } from 'react';
import { Tab, Row } from './Tabs.styled';

export type Tab = {
  title: string;
  type: string;
};

export interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  setActiveTab: Dispatch<SetStateAction<string>>;
}

const Tabs = ({ tabs, activeTab, setActiveTab }: TabsProps): JSX.Element => (
  <Row justifyContent="flex-start" margin="0 0 40px 0">
    {tabs.map(({ title, type }) => (
      <Tab
        key={type}
        onClick={() => setActiveTab(type)}
        isActive={activeTab === type}>
        {title}
      </Tab>
    ))}
  </Row>
);

export default memo(Tabs);
