import { RankedMode } from ".prisma/client";
import { Box, Flex } from "@chakra-ui/react";
import xRankService, { XTrends } from "app/xrank/service";
import ModeSelector from "components/common/ModeSelector";
import MyHead from "components/common/MyHead";
import Page from "components/common/Page";
import TrendTier from "components/xtrends/TrendTier";
import { useMyTheme } from "hooks/common";
import { GetStaticProps } from "next";
import { useState } from "react";
import { xTrendsTiers } from "utils/constants";

export interface XTrendsPageProps {
  trends: XTrends;
}

const XTrendsPage = ({ trends }: XTrendsPageProps) => {
  const { gray } = useMyTheme();
  const [mode, setMode] = useState<RankedMode>("SZ");

  return (
    <>
      <MyHead title="Top 500 Trends" />
      <Page>
        <Flex flexDir={["column", null, "row"]} justify="space-between">
          <ModeSelector
            mode={mode}
            setMode={setMode}
            mx={["auto", null, "0"]}
            mb={[4, null, 0]}
          />
        </Flex>
        {xTrendsTiers.map((tier, i) => (
          <TrendTier
            key={tier.label}
            tier={tier}
            data={trends[mode].filter((weapon, _, arr) => {
              const targetCount = 1500 * (tier.criteria / 100);
              const previousTargetCount =
                i === 0
                  ? Infinity
                  : 1500 * (xTrendsTiers[i - 1].criteria / 100);

              return (
                weapon.count >= targetCount &&
                weapon.count < previousTargetCount
              );
            })}
          />
        ))}
        <Box color={gray} fontSize="sm">
          Weapons are ordered based on their appearance in the Top 500 of X Rank
          in the last three months. Average X Power per weapon is also shown.
          Progress icon describes the change with the latest month.
        </Box>
      </Page>
    </>
  );
};

export default XTrendsPage;

export const getStaticProps: GetStaticProps<XTrendsPageProps> = async () => {
  const trends = await xRankService.getXTrendsNew();

  return { props: { trends } };
};
