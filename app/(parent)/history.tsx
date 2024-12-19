import axios, { AxiosError } from "axios";
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { DataTable } from "react-native-paper";

interface PickUpData {
  id: string;
  receiver_name: string;
  receiver_surname: string;
  teacher_name: string;
  teacher_surname: string;
  decision: boolean;
  date: string;
  child: string;
  child_name: string;
  child_surname: string;
  receiver: string;
  teacher: string;
}

const History: React.FC = () => {
  const [page, setPage] = useState<number>(0);
  const [itemsPerPage, onItemsPerPageChange] = useState(10);

  const [items, setItems] = useState<Array<PickUpData>>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const from = page * itemsPerPage;
  const to = Math.min((page + 1) * itemsPerPage, items.length);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await axios.get(
          `${process.env.EXPO_PUBLIC_API_URL}/parent/history`
        );
        if (response?.data) {
          const { data } = response;
          setItems(data.history);

          setPage(0);
          setLoading(false);
        }
      } catch (error) {
        const e = error as AxiosError;
        if (!e.response) {
          alert("Błąd połączenia z serwerem.");
          setLoading(false);
          return;
        }
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [itemsPerPage]);

  const mapDataToRows = (data: Array<PickUpData>) => {
    return data.map((row, index) => ({
      child: `${row.child_name} ${row.child_surname}`,
      receiver: `${row.receiver_name} ${row.receiver_surname}`,
      teacher: `${row.teacher_name} ${row.teacher_surname}`,
      decision: row.decision,
      date: new Date(row.date).toLocaleString(),
    }));
  };

  return (
    <View>
      <Text style={styles.text}>Historia Odbiorów</Text>
      <DataTable>
        <DataTable.Header style={styles.row}>
          <DataTable.Title style={styles.cell}>Odbierający</DataTable.Title>
          <DataTable.Title style={styles.cell}>Dziecko</DataTable.Title>
          <DataTable.Title style={styles.cell}>Nauczyciel</DataTable.Title>
          <DataTable.Title style={styles.cell}>Data</DataTable.Title>
        </DataTable.Header>
        {loading && <Text>Wczytywanie...</Text>}
        {!loading && (
          <>
            {mapDataToRows(items)
              .slice(from, to)
              .map((item) => (
                <DataTable.Row
                  key={item.date}
                  style={[
                    styles.row,
                    item.decision ? styles.decisionYes : styles.decisionNo,
                  ]}
                >
                  <DataTable.Cell style={styles.cell}>
                    <Text>{item.receiver}</Text>
                  </DataTable.Cell>
                  <DataTable.Cell style={styles.cell}>
                    <Text>{item.child}</Text>
                  </DataTable.Cell>
                  <DataTable.Cell style={styles.cell}>
                    <Text>{item.teacher}</Text>
                  </DataTable.Cell>
                  <DataTable.Cell style={styles.cell}>
                    <Text>{item.date}</Text>
                  </DataTable.Cell>
                </DataTable.Row>
              ))}

            <DataTable.Pagination
              page={page}
              numberOfPages={Math.ceil(items.length / itemsPerPage)}
              onPageChange={(page) => setPage(page)}
              label={`${from + 1}-${to} of ${items.length}`}
              numberOfItemsPerPage={itemsPerPage}
              onItemsPerPageChange={onItemsPerPageChange}
              showFastPaginationControls
              selectPageDropdownLabel={"Rows per page"}
            />
          </>
        )}
      </DataTable>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    margin: 5,
    marginBottom: 0,
    paddingHorizontal: 0,
    borderRadius: 10,
  },
  cell: {
    width: "auto",
    paddingHorizontal: 10,
  },
  decisionYes: {
    backgroundColor: "#22C55E",
  },
  decisionNo: {
    backgroundColor: "#EF4444",
  },
  text: {
    fontSize: 20,
    color: "#000",
    textAlign: "center",
    padding: 20,
  },
});

export default History;
