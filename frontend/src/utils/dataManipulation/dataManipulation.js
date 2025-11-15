import * as handler from "./filterHandler";

export const sliceTelegramCsv = (csvData, filters) => {
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
      (channelExists && filters.channels.includes(row[channelNameKey].trim()));

    const content = row.content;
    const belongToChannels =
      !content ||
      !filters.keywords.length ||
      filters.keywords.some((keyword) => content.includes(keyword));

    return belongToChannels && betweenDates && channelMatches;
  });

  return filteredData;
};

export const sliceTwitterCsv = (csvData, filters) => {
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
          row.user_posted.includes(`${user}`)
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
    // row.tagged_users &&
    //   (!filters.tagged_users.length ||
    //     filters.tagged_users.some((user) =>
    //       row.tagged_users.includes(`${user}`)
    //     ));

    // Filter for replies (with range support for min/max)
    const isRepliesMatch =
      row.replies &&
      row.replies >= Number(filters.repliesMin) &&
      row.replies <= Number(filters.repliesMax);

    // console.log("isLikesMatch", isRepliesMatch);
    // console.log("replies", isRepliesMatch);

    // Filter for reposts (with range support for min/max)
    const isRepostsMatch =
      row.reposts &&
      row.reposts >= Number(filters.repostsMin) &&
      row.reposts <= Number(filters.repostsMax);
    // console.log("isRepostsMatch", isRepostsMatch);
    // Filter for likes (with range support for min/max)
    const isLikesMatch =
      row.likes &&
      row.likes >= Number(filters.likesMin) &&
      row.likes <= Number(filters.likesMax);

    // Filter for views (with range support for min/max)
    const isViewsMatch =
      row.views &&
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
