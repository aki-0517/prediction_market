const SportType = {
  Basketball: 1,
  Baseball: 2,
  Hockey: 3,
  Rugby: 4,
  Soccer: 5,
}

const Result = {
  None: 0,
  Home: 1,
  Away: 2,
}

const sportId = Number(args[0])
const gameId = args[1]

if (secrets.apikey == "") {
  throw Error(
    "API_KEY environment variable not set for Sports API. Get a free key from https://dashboard.api-football.com/register"
  )
}
if (Object.values(SportType).indexOf(sportId) == -1) {
  throw Error("Invalid sportId")
}
if (gameId == "" || gameId == "0") {
  throw Error("Invalid gameId")
}

const baseUrls = {
  [SportType.Basketball]: "https://v1.basketball.api-sports.io",
  [SportType.Baseball]: "https://v1.baseball.api-sports.io",
  [SportType.Hockey]: "https://v1.hockey.api-sports.io",
  [SportType.Rugby]: "https://v1.rugby.api-sports.io",
  [SportType.Soccer]: "https://v3.football.api-sports.io",
}

const gamesPaths = {
  [SportType.Basketball]: "/games",
  [SportType.Baseball]: "/games",
  [SportType.Hockey]: "/games",
  [SportType.Rugby]: "/games",
  [SportType.Soccer]: "/fixtures",
}

/**
 * スポーツデータをフェッチするメソッド
 */
const fetchSportData = async (sport, path, params) => {
  console.log("sport:", sport)
  console.log("baseUrls[sport]:", baseUrls[sport])
  console.log("path", path)
  console.log("params:", params)

  // APIをコールする
  const response = await Functions.makeHttpRequest({
    method: 'GET',
    url: `${baseUrls[sport]}${path}?${params}`,
    headers: { 
      'X-RapidAPI-Key': secrets.apiKey,
      'X-RapidAPI-Host': 'v2.nba.api-sports.io'
    },
  })

  // console.log("response:", response)

  if (response.status !== 200) {
    throw new Error(`Status ${response.status}`)
  }
  if (Object.keys(response.data.errors).length > 0) {
    console.error(JSON.stringify(response.data.errors))
    throw new Error("API error")
  }
  if (response.data.results === 0) {
    throw new Error(`Game ${gameId} not found`)
  }
  return response.data.response[0]
}

/**
 * 試合結果を取得する
 * @returns 
 */
const getGameResult = async (sport, gameId) => {
  // fetchSportData メソッドを呼び出す。
  const data = await fetchSportData(sport, gamesPaths[sport], `id=${gameId}`)
  // getGameStatus メソッドを呼び出す。
  const status = getGameStatus(sport, data)

  console.log("data:", data)
  console.log("status:", status)

  if (status == "POST" || status == "CANC" || status == "INTR" || status == "ABD") {
    return Functions.encodeUint256(Result.None)
  }
  if (status != "FT") {
    throw new Error("Game not finished")
  }
  // 勝者を取得する。
  const winner = getGameWinner(sport, data)
  console.log("winner:", winner)
  return Functions.encodeUint256(winner)
}

/**
 * 試合の結果を取得するメソッド
 */
const getGameStatus = (sport, data) => {
  if (sport == SportType.Soccer) {
    return data.fixture.status.short
  } else {
    return data.status.short
  }
}

/**
 * 試合の勝者を取得するメソッド
 */
const getGameWinner = (sport, data) => {
  switch (sport) {
    case SportType.Basketball:
      return data.scores.home.total > data.scores.away.total ? Result.Home : Result.Away
    case SportType.Hockey:
    case SportType.Baseball:
      return data.scores.home.total > data.scores.away.total ? Result.Home : Result.Away
    case SportType.Hockey:
    case SportType.Rugby:
      return data.scores.home == data.scores.away
        ? Result.None
        : data.scores.home > data.scores.away
        ? Result.Home
        : Result.Away
    case SportType.Soccer:
      return data.goals.home == data.goals.away
        ? Result.None
        : data.goals.home > data.goals.away
        ? Result.Home
        : Result.Away
    default:
      throw new Error(`Sport ${sport} not supported`)
  }
}

return getGameResult(sportId, gameId)
