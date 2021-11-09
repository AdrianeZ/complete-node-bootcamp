class APIFeatures
{

  constructor(query, queryString)
  {
    this.queryString = queryString;
    this.query = query;
    this._clearQuery();
  }

  _clearQuery()
  {
    const obj = {};
    Object.keys(this.queryString).map(key => {
      const safeKey = key.trim();
      obj[safeKey] = this.queryString[key];
    })
    this.queryString = obj;
  }

  filter()
  {
    let filters = {...this.queryString};
    const excludedFields = ["page", "sort", "limit", "fields"];
    for (const fieldToDelete of excludedFields) delete filters[fieldToDelete];
    filters = JSON.stringify(filters);
    filters = JSON.parse(filters.replace(/\b(lt|lte|gt|gte)\b/g, match => `$${match}`));
    this.query.find(filters);
    return this;
  }

  limitFields()
  {
    const {fields} = this.queryString;
    if (fields) this.query.select(fields.split(",").join(" "));
    else this.query.select("-__v");
    return this;
  }

  paginate()
  {
    const {page, limit} = this.queryString;
    const parsedPage = Number(page) || 1;
    const parsedLimit = Number(limit) || 100;
    const skip = parsedPage * parsedLimit - parsedLimit;
    this.query.skip(skip).limit(parsedLimit);
    return this;
  }

  sort()
  {
    const {sort} = this.queryString;
    if (sort) this.query.sort(sort.split(",").join(" "));
    this.query.sort("-createdAt, price");

    return this;
  }

  getQuery()
  {
    return this.query;
  }
}

module.exports = APIFeatures;