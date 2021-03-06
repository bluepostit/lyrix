import * as Artists from '../pages/artists'
import { SongImporter } from '../pages/song-importer'
import * as Songlists from '../pages/songlists'
import * as SongItems from '../pages/song-items'
import * as Songs from '../pages/songs'
import {
  withSearch,
  withSubscription
} from '../components/data'
import DataSource from '../data/data-source'

const SongItemPage = withSubscription({
  Component: SongItems.Show,
  dataSource: DataSource,
  dataEntity: 'songItem',
  useRouteParams: true
})

const SongItemsPage = withSubscription({
  Component: SongItems.Index,
  dataSource: DataSource,
  dataEntity: 'songItems'
})

const SongPage = withSubscription({
  Component: Songs.Show,
  dataSource: DataSource,
  dataEntity: 'song',
  useRouteParams: true
})

const SongsPage = withSubscription({
  Component: Songs.Index,
  dataSource: DataSource,
  dataEntity: 'songs'
})

const SonglistsPage = withSubscription({
  Component: Songlists.Index,
  dataSource: DataSource,
  dataEntity: 'songlists'
})

const SonglistPage = withSubscription({
  Component: Songlists.Show,
  dataSource: DataSource,
  dataEntity: 'songlist',
  useRouteParams: true
})

const ArtistPage = withSubscription({
  Component: Artists.Show,
  dataSource: DataSource,
  dataEntity: 'artist',
  useRouteParams: true
})

const ArtistsPage = withSubscription({
  Component: Artists.Index,
  dataSource: DataSource,
  dataEntity: 'artists'
})

const ImporterPage = withSubscription({
  Component: withSearch({
    Component: SongImporter,
    dataSource: DataSource,
    dataEntity: 'importerSearch'
  }),
  dataSource: DataSource,
  dataEntity: 'importerSearch',
  useRouteParams: false,
  noTrigger: true
})

const withSongForm = (component) => {
  return withSubscription({
    Component: withSearch({
      Component: withSubscription({
        Component: component,
        dataSource: DataSource,
        dataEntity: 'lyrics',
        dataAttrName: 'lyricsData',
        lyricsNoTrigger: true
      }),
      dataSource: DataSource,
      dataEntity: 'lyrics',
    }),
    dataSource: DataSource,
    dataEntity: 'artists',
    dataAttrName: 'artistsData',
  })
}

const NewSongPage = withSongForm(Songs.New)
const EditSongPage = withSubscription({
  Component: withSongForm(Songs.Edit),
  dataSource: DataSource,
  dataEntity: 'song',
  dataAttrName: 'songData',
  useRouteParams: true
})

const withSongItemForm = (component) => {
  return withSubscription({
    Component: withSubscription({
      Component: component,
      dataSource: DataSource,
      dataEntity: 'song',
      dataAttrName: 'songData',
      useRouteParams: true
    }),
    dataSource: DataSource,
    dataEntity: 'songItemTypes',
    dataAttrName: 'songItemTypesData'
  })
}

const NewSongItemPage = withSongItemForm(SongItems.New)
const EditSongItemPage = withSubscription({
  Component: withSubscription({
    Component: SongItems.Edit,
    dataSource: DataSource,
    dataEntity: 'songItemTypes',
    dataAttrName: 'songItemTypesData'
  }),
  dataSource: DataSource,
  dataEntity: 'songItem',
  dataAttrName: 'songItemData',
  useRouteParams: true
})

export {
  ArtistPage,
  ArtistsPage,
  ImporterPage,
  NewSongPage,
  EditSongPage,
  NewSongItemPage,
  EditSongItemPage,
  SongPage,
  SongsPage,
  SongItemPage,
  SongItemsPage,
  SonglistPage,
  SonglistsPage
}
