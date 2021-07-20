import { FC, useState, ReactNode } from 'react';
import { TooltipIconContainer, TooltipContent } from './Tooltip.styled';

type Props = {
  text: string;
  numberOfLines: number;
  isLeftAlignedToParent?: boolean;
  children?: string | ReactNode;
};

const TooltipIcon: FC<{ color: string }> = ({ color }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24">
    <g fillRule="nonzero" fill="none">
      <path d="M0 0h24v24H0z" />
      <path
        fill={color}
        d="M12 2a10 10 0 100 20 10 10 0 000-20zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"
      />
    </g>
  </svg>
);

const Tooltip: FC<Props> = ({
  text,
  numberOfLines,
  isLeftAlignedToParent,
  children,
}) => {
  const [isActive, setIsActive] = useState<boolean>(false);

  const hoverContent = children ? (
    <div
      onMouseEnter={() => setIsActive(true)}
      onMouseLeave={() => setIsActive(false)}>
      {children}
    </div>
  ) : (
    <TooltipIconContainer
      onMouseEnter={() => setIsActive(true)}
      onMouseLeave={() => setIsActive(false)}>
      <TooltipIcon color={isActive ? '#1A1A1A' : '#CCC'} />
    </TooltipIconContainer>
  );

  return (
    <>
      {hoverContent}
      <TooltipContent
        numberOfLines={numberOfLines}
        isActive={isActive}
        isLeftAlignedToParent={isLeftAlignedToParent}>
        {text}
      </TooltipContent>
    </>
  );
};

export default Tooltip;
