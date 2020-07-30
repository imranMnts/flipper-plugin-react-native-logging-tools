import React from 'react';
import { Text, styled, Button, FlexColumn, FlipperPlugin, DetailSidebar, SearchableTable } from 'flipper';
import { COLUMNS, COLUMN_SIZE } from './config';
import SideBar from './components/SideBar';
import { getDataWithID, formatEvent } from './utils/functions';

const MainContainer = styled.div({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
});

const ActionsContainer = styled.div({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  flex: 1,
});

interface PersistedState {
  events: Array<Row>;
}

interface State {
  selectedIds: Array<number>;
  selectedData: Row | null;
}

interface Row {
  id: number;
  service: string;
  event: string;
  error?: string;
  params?: string;
  time: string;
}

export default class extends FlipperPlugin<State, never, PersistedState> {
  id = 'flipper-plugin-react-native-logging-tools';

  constructor(props: any) {
    super(props);
    this.state = {
      selectedIds: [],
      selectedData: null,
    };
    this.handleClear = this.handleClear.bind(this);
    this.handleRowHighlighted = this.handleRowHighlighted.bind(this);
  }

  static defaultPersistedState = {
    events: [],
  }

  static persistedStateReducer(persistedState: PersistedState, method: string, data: Row): PersistedState {
    try {
      switch (method) {
        case 'action': {
          let lastPersistedActions = persistedState.events;
          if (!lastPersistedActions) {
            lastPersistedActions = [];
          }
          return {
            events: [...lastPersistedActions, getDataWithID(lastPersistedActions, data)],
          };
        }
        default:
          return persistedState;
      }
    } catch (err) {
      return persistedState;
    }
  }

  handleClear() {
    const { setPersistedState } = this.props;
    this.setState({ selectedIds: [] });
    setPersistedState({ events: [] });
  }

  handleRowHighlighted(keys: Array<any>) {
    const { persistedState } = this.props as { persistedState: PersistedState };
    const { selectedIds } = this.state;

    const selectedId = keys.length !== 1 ? null : keys[0];
    if (selectedIds.includes(selectedId) || !persistedState.events) {
      return this.setState({
        selectedIds: [],
      });
    }
    const selectedData: Row | undefined = persistedState.events.find((v: any) => v.id === selectedId);

    if (selectedData) {
      const { service, id, event, error, params, time } = selectedData;

      this.setState({
        selectedIds: [selectedId],
        selectedData: {
          id,
          service,
          event,
          error,
          params,
          time,
        },
      });
    }
  }

  renderSidebar() {
    const { selectedIds, selectedData } = this.state;
    const selectedId = selectedIds[0];
    if (!selectedData || !selectedId) {
      return null;
    }
    return <SideBar {...selectedData} />;
  }

  buildRow(row: Row) {
    return {
      columns: {
        service: {
          value: <Text>{row.service}️</Text>,
          filterValue: row.service,
        },
        event: {
          value: <Text>{formatEvent(row.event)}</Text>,
          filterValue: row.event,
        },
      },
      key: row.id,
      copyText: JSON.stringify(row, null, 2),
      filterValue: `${row.service} ${row.event}`,
    };
  }

  render() {
    const { persistedState = {} } = this.props;
    const { events = [] } = persistedState as PersistedState;
    const rows = events.map(this.buildRow);

    return (
      <FlexColumn grow>
        <MainContainer>
          <Text style={{ fontSize: 17, padding: 5, paddingLeft: 10, paddingRight: 10, fontWeight: 'bold' }}>
            🔔 Events
          </Text>
          <ActionsContainer>
            <SearchableTable
              key={this.id}
              rowLineHeight={30}
              floating={false}
              multiline
              columnSizes={COLUMN_SIZE}
              columns={COLUMNS}
              onRowHighlighted={this.handleRowHighlighted}
              multiHighlight
              rows={rows}
              stickyBottom
              actions={
                <>
                  <Button onClick={this.handleClear}>🧹 Clear events</Button>
                </>
              }
            />
          </ActionsContainer>
        </MainContainer>
        <DetailSidebar>{this.renderSidebar()}</DetailSidebar>
      </FlexColumn>
    );
  }
}
