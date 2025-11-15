import * as handler from "./filterHandler";

interface TelegramRow {
  date: string;
  time: string;
  'channel name'?: string;
  content?: string;
  [key: string]: any;
}

interface TwitterRow {
  date_posted: string;
  user_posted?: string;
  description?: string;
  tagged_users?: string;
  replies?: number;
  reposts?: number;
  likes?: number;
  views?: number;
  hashtags?: string;
  [key: string]: any;
}

interface TelegramFiltersData {
  startDate?: string;
  endDate?: string;
  channels: string[];
  keywords: string[];
}

interface TwitterFiltersData {
  dateStart?: string;
  dateEnd?: string;
  user_posted: string[];
  description?: string;
  tagged_users: string[];
  repliesMin: number;
  repliesMax: number;
  repostsMin: number;
  repostsMax: number;
  likesMin: number;
  likesMax: number;
  viewsMin: number;
  viewsMax: number;
  hashtags: string[];
}

export const sliceTelegramCsv = (csvData: TelegramRow[], filters: TelegramFiltersData): TelegramRow[] => {
  const filteredData = csvData.filter((row) => {
    const rowDateTime = new Date(`${row.date}T${row.time}`);
    const startDate = filters.startDate ? new Date(filters.startDate) : null;
    const endDate = filters.endDate ? new Date(filters.endDate) : null;
    const betweenDates =
      (!startDate || rowDateTime >= startDate) &&
      (!endDate || rowDateTime <= endDate);
    const channelNameKey = "channel name";
    const channelExists = channelNameKey in row;

    const channelMatches =
      !filters.channels.length ||
      (channelExists && filters.channels.includes((row[channelNameKey] as string).trim()));

    const content = row.content;
    const belongToChannels =
      !content ||
      !filters.keywords.length ||
      filters.keywords.some((keyword) => content.includes(keyword));

    return belongToChannels && betweenDates && channelMatches;
  });

  return filteredData;
};

export const sliceTwitterCsv = (csvData: TwitterRow[], filters: TwitterFiltersData): TwitterRow[] => {
  console.log("Slicing Twitter");
  console.log(filters);
  return csvData.filter((row) => {
    // Convert date_posted to Date object for comparison
    const rowDate = new Date(row.date_posted);
    const startDate = filters.dateStart ? new Date(filters.dateStart) : null;
    const endDate = filters.dateEnd ? new Date(filters.dateEnd) : null;
    const betweenDates =
      startDate !== null &&
      endDate !== null &&
      (!startDate || rowDate >= startDate) &&
      (!endDate || rowDate <= endDate);

    const includesUserPoster =
      row.user_posted &&
      (!filters.user_posted.length ||
        filters.user_posted.some((user) =>
          row.user_posted!.includes(`${user}`)
        ));

    // Filter for description
    const includesDescription =
      row.description &&
      (!filters.description ||
        row.description
          .toLowerCase()
          .includes(filters.description.toLowerCase()));

    const includesTaggedUsers = handler.listRepFromFilterList(
      row.tagged_users, // string rep of list
      filters.tagged_users
    );

    // Filter for replies (with range support for min/max)
    const isRepliesMatch =
      row.replies !== undefined &&
      row.replies >= Number(filters.repliesMin) &&
      row.replies <= Number(filters.repliesMax);

    // Filter for reposts (with range support for min/max)
    const isRepostsMatch =
      row.reposts !== undefined &&
      row.reposts >= Number(filters.repostsMin) &&
      row.reposts <= Number(filters.repostsMax);

    // Filter for likes (with range support for min/max)
    const isLikesMatch =
      row.likes !== undefined &&
      row.likes >= Number(filters.likesMin) &&
      row.likes <= Number(filters.likesMax);

    // Filter for views (with range support for min/max)
    const isViewsMatch =
      row.views !== undefined &&
      row.views >= Number(filters.viewsMin) &&
      row.views <= Number(filters.viewsMax);

    // Filter for hashtags
    const includesHashtags = handler.filtersAndForUserListAndRowList(
      row.hashtags, // string rep of list
      filters.hashtags
    );

    return (
      betweenDates &&
      includesUserPoster &&
      includesDescription &&
      includesTaggedUsers &&
      isRepliesMatch &&
      isRepostsMatch &&
      isLikesMatch &&
      isViewsMatch &&
      includesHashtags
    );
  });
};
