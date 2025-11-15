/**
 * this functions takes feature and checks if its in row
 * returns boolean
 */
export const listRepFromFilterList = (rowStrRep: string | null | undefined, filterLst: string[]): boolean => {
  if (!rowStrRep || filterLst.length === 0) {
    return true;
  }
  if (rowStrRep.length === 2) {
    return false;
  }

  const hashtagsList = rowStrRep.split(",");
  if (hashtagsList === (rowStrRep as any)) {
    return filterLst.some((hashtag) => hashtagsList.includes(hashtag));
  } else {
    for (const hashtag of hashtagsList) {
      for (const filter of filterLst) {
        if (hashtag.includes(filter)) {
          return true;
        }
      }
    }
    return false;
  }
};

/**
 * Filters and checks for user list and row list
 */
export const filtersAndForUserListAndRowList = (
  hashtagsInRowAsString: string | null | undefined,
  userFilterLst: string[]
): boolean => {
  if (userFilterLst.length === 0) {
    return true;
  }
  if (hashtagsInRowAsString == null || hashtagsInRowAsString.length === 2) {
    return false;
  }

  const hashtagsList = hashtagsInRowAsString.split(",");

  let includeInRow = true;
  for (const filter of userFilterLst) {
    let isHashtagCoversFilter = false;
    for (const hashtag of hashtagsList) {
      isHashtagCoversFilter =
        isHashtagCoversFilter ||
        hashtag.toLowerCase().includes(filter.toLowerCase());
    }
    includeInRow = includeInRow && isHashtagCoversFilter;
  }

  return includeInRow;
};
