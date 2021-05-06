import { ChangeEvent, KeyboardEvent, useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import SearchInputResultsList from '../SearchInputResultsList';
import {
  InputContainer,
  Input,
  MagnifyingIconButton,
  ClearTextButton,
} from './SearchInput.styled';
import {
  SearchCollection,
  getSearchCollections,
} from '../../services/collections';
import { DEFAULT_COLLECTION } from '../../utils/constants';
import { ReactComponent as MagnifyingIcon } from '../../public/icon-light-search-24-px.svg';
import { ReactComponent as CloseIcon } from '../../public/icon-light-close-16-px.svg';

type Props = {
  isMobileSearchOpen: boolean;
  closeMobileSearch: () => void;
};

const defaultSearchCollection: SearchCollection = {
  name: DEFAULT_COLLECTION,
  img: '',
};

const SearchInput = ({
  isMobileSearchOpen,
  closeMobileSearch,
}: Props): JSX.Element => {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>();
  const clearTextButtonRef = useRef<HTMLButtonElement>();
  const resultsListRef = useRef<HTMLUListElement>();
  const [input, setInput] = useState<string>('');
  const [isSearchInputActive, setIsSearchInputActive] = useState<boolean>(
    false
  );
  const [searchCollections, setSearchCollections] = useState<
    SearchCollection[]
  >([defaultSearchCollection]);

  useEffect(() => {
    const removeInputFocusStyle = (e: MouseEvent) => {
      if (
        !['INPUT', 'BUTTON', 'svg', 'path'].includes(
          (e.target as HTMLInputElement).nodeName
        )
      ) {
        setInput('');
        setIsSearchInputActive(false);
        closeMobileSearch();
      }
    };
    window.addEventListener('click', removeInputFocusStyle);
    window.addEventListener('touchstart', removeInputFocusStyle);
    return () => {
      window.removeEventListener('click', removeInputFocusStyle);
      window.removeEventListener('touchstart', removeInputFocusStyle);
    };
  }, []);

  useEffect(() => {
    (async () => {
      if (isSearchInputActive) {
        const collections = await getSearchCollections();
        setSearchCollections(collections);
      }
    })();
  }, [isSearchInputActive]);

  const updateText = (e: ChangeEvent<HTMLInputElement>) =>
    setInput(e.target.value);

  const clearText = () => {
    if (input) {
      setInput('');
    } else {
      closeMobileSearch();
    }
  };

  const search = (type: string) => {
    setInput('');
    setIsSearchInputActive(false);
    if (!type) return;
    router.push(`/search?keywords=${type.toLowerCase()}`);
  };

  const handleClearTextButtonKeyDown = (e: KeyboardEvent) => {
    const isDownArrow = e.key === 'ArrowDown';
    const isTab = e.key === 'Tab' && !e.shiftKey;
    if (resultsListRef.current && (isDownArrow || isTab)) {
      e.preventDefault();
      const firstResultItem = resultsListRef.current
        .childNodes[1] as HTMLElement;
      firstResultItem.focus();
    }
  };

  const handleInputKeyDown = (e: KeyboardEvent) => {
    if (!input) return;

    if (e.key === 'Enter') {
      search(input);
      return;
    }

    const isDownArrow = e.key === 'ArrowDown';
    if (isDownArrow) {
      e.preventDefault();
      const firstResultItem = resultsListRef.current
        .childNodes[1] as HTMLElement;
      firstResultItem.focus();
      return;
    }

    const isTab = e.key === 'Tab' && !e.shiftKey;
    if (isTab) {
      e.preventDefault();
      clearTextButtonRef.current.focus();
    }
  };

  const collections = searchCollections
    .filter(({ name }) => {
      const isFragment = name.toLowerCase().includes(input.toLowerCase());
      return isFragment;
    })
    .slice(0, 5);

  return (
    <InputContainer
      tabIndex={-1}
      isMobileSearchOpen={isMobileSearchOpen}
      isSearchInputActive={isSearchInputActive}>
      <MagnifyingIconButton onClick={() => search(input)}>
        <MagnifyingIcon />
      </MagnifyingIconButton>
      <Input
        ref={inputRef}
        required
        type="text"
        placeholder="Search by collection"
        value={input}
        onChange={updateText}
        onKeyDown={handleInputKeyDown}
        onFocus={() => setIsSearchInputActive(true)}
      />
      <ClearTextButton
        ref={clearTextButtonRef}
        onClick={clearText}
        isVisibleOnDesktop={input.length !== 0}
        onKeyDown={handleClearTextButtonKeyDown}>
        <CloseIcon />
      </ClearTextButton>
      {input && collections.length !== 0 && (
        <SearchInputResultsList
          input={input}
          collections={collections}
          inputRef={inputRef}
          resultsListRef={resultsListRef}
          clearTextButtonRef={clearTextButtonRef}
          search={search}
          setInput={setInput}
        />
      )}
    </InputContainer>
  );
};

export default SearchInput;
