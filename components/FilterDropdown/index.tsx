import { FC, useState } from 'react';
import {
  MenuContainer,
  MenuButton,
  MenuButtonText,
  Menu,
  MenuItem,
  TransparentBackground,
} from './FilterDropdown.styled';
import { ReactComponent as DownArrow } from '../../public/down-arrow-sm.svg';
import { ReactComponent as Checkmark } from '../../public/icon-light-check-24-px.svg';
import { useScrollLock, useEscapeKeyClose } from '../../hooks';
import { Filter } from '../../utils/constants';

export type FilterDropdownProps = {
  filters: Filter[];
  activeFilter: Filter;
  handleFilterClick: (filter: Filter) => void;
};

const FilterDropdown: FC<FilterDropdownProps> = ({
  filters = [],
  activeFilter = undefined,
  handleFilterClick = () => {},
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const togglePopupMenu = () => setIsOpen(!isOpen);
  const closePopupMenu = () => setIsOpen(false);
  useScrollLock(isOpen);
  useEscapeKeyClose(closePopupMenu);

  return (
    <MenuContainer>
      <MenuButton onClick={togglePopupMenu}>
        <MenuButtonText>Sort by</MenuButtonText>
        <DownArrow />
      </MenuButton>
      <Menu isOpen={isOpen}>
        {filters.map((filter) => (
          <MenuItem
            key={filter.label}
            tabIndex={0}
            onClick={() => {
              handleFilterClick(filter);
              closePopupMenu();
            }}>
            <span>{filter.label}</span>
            <span>
              {activeFilter && activeFilter.label === filter.label && (
                <Checkmark />
              )}
            </span>
          </MenuItem>
        ))}
      </Menu>
      <TransparentBackground isOpen={isOpen} onClick={closePopupMenu} />
    </MenuContainer>
  );
};

export default FilterDropdown;
