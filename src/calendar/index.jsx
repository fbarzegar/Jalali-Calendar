import { useState, useEffect } from "react";
import { MdAdd } from "react-icons/md";
import { toast } from "react-toastify";
import moment from "jalali-moment";
import Swal from "sweetalert2";
import useLocalStorage from "use-local-storage";
import {
  Autocomplete,
  Card,
  CardContent,
  TextField,
  Box,
  Typography,
  Button,
} from "@mui/material";
// import Modal from "./Modal";

let abortControllerGetHolidayDate = new AbortController();

const persianMonths = [
  "فروردین",
  "اردیبهشت",
  "خرداد",
  "تیر",
  "مرداد",
  "شهریور",
  "مهر",
  "آبان",
  "آذر",
  "دی",
  "بهمن",
  "اسفند",
];

const weekDays = [
  "شنبه",
  "یکشنبه",
  "دوشنبه",
  "سه‌شنبه",
  "چهارشنبه",
  "پنجشنبه",
  "جمعه",
];
const dateFormat = "YYYY-MM-DD";

const Calendar = () => {
  const darkMode = useLocalStorage(
    "darkMode",
    window.matchMedia("(prefers-color-scheme: dark)").matches
  )[0];

  // const [addModal, setAddModal] = useState(false);
  const [selectedHoliday, setSelectedHoliday] = useState(null);
  const [year, setYear] = useState(moment().jYear());
  const [month, setMonth] = useState(moment().jMonth() + 1);
  const [holidays, setHolidays] = useState([]);
  const [calendarMatrix, setCalendarMatrix] = useState([]);

  const getHolidays = (year) => {
    // کد دریافت دیتای تعطیلات تقویم
  };

  // const reload = () => {
  //   getHolidays(year);
  //   setSelectedHoliday(null);
  // };

  useEffect(() => {
    document.title = `مدیریت تعطیلات رسمی`;
    abortControllerGetHolidayDate = new AbortController();

    return () => {
      abortControllerGetHolidayDate.abort();
      toast.dismiss();
    };
  }, []);

  useEffect(() => {
    getHolidays(year);
  }, [year]);

  useEffect(() => {
    const firstDay = moment
      .from(`${year}/${month}/01`, "fa", "jYYYY/jMM/jDD")
      .add(1, "day");
    const daysInMonth = firstDay.jDaysInMonth();
    const matrix = [];
    let week = [];
    const startWeekDay = firstDay.day();

    for (let i = 0; i < startWeekDay; i++) week.push(null);

    for (let day = 1; day <= daysInMonth; day++) {
      const date = moment.from(
        `${year}/${month}/${day}`,
        "fa",
        "jYYYY/jMM/jDD"
      );
      week.push(date);
      if (week.length === 7) {
        matrix.push(week);
        week = [];
      }
    }

    if (week.length > 0) {
      while (week.length < 7) week.push(null);
      matrix.push(week);
    }

    setCalendarMatrix(matrix);
  }, [year, month, holidays]);

  const getHolidaysForDay = (date) => {
    return holidays.filter(
      (h) =>
        moment(h.date).format(dateFormat) === moment(date).format(dateFormat)
    );
  };

  const handleDayClick = (date, holiday = null) => {
    if (holiday) {
      // رویداد موجود، بررسی قابلیت ویرایش
      if (!holiday.isImported) {
        Swal.fire({
          text: holiday.title || "این رویداد قابل ویرایش نیست.",
          confirmButtonText: "بستن",
          customClass: {
            confirmButton: "custom-swal-button",
            popup: "custom-swal-popup",
          },
          buttonsStyling: false,
        });
        return;
      }

      setSelectedHoliday({
        ...holiday,
        allHolidaysOfDay: getHolidaysForDay(date),
      });
      setAddModal(true);
    } else {
      // رویداد جدید
      setSelectedHoliday({
        date: moment(date).toDate(),
        title: "",
        id: null,
        allHolidaysOfDay: [],
      });
      setAddModal(true);
    }
  };

  return (
    <Box py={3}>
      <Card>
        <CardContent>
          <Box sx={{ display: "flex", justifyContent: "space-between", my: 2 }}>
            <Button
              color="info"
              onClick={() => {
                setAddModal(true);
                setSelectedHoliday(null);
              }}
              startIcon={<MdAdd />}
              variant="outlined"
              size="samll"
            >
              افزودن تعطیلات جدید
            </Button>

            <Box sx={{ display: "flex" }}>
              <Button
                color="info"
                variant="outlined"
                size="small"
                onClick={() => {
                  const today = moment();
                  setYear(today.jYear());
                  setMonth(today.jMonth() + 1);
                }}
                sx={{ mr: 1, height: "40px" }}
              >
                امروز
              </Button>
              <TextField
                type="number"
                value={year}
                onChange={(event) => setYear(Number(event.target.value))}
                label="سال"
                min={1390}
                max={1410}
                sx={{ "& .MuiInputBase-root": { maxHeight: "40px" }, mr: 1 }}
              />
              <Autocomplete
                options={persianMonths}
                value={persianMonths[month - 1]}
                onChange={(_, newValue) => {
                  if (newValue) setMonth(persianMonths.indexOf(newValue) + 1);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="ماه"
                    sx={{
                      "& .MuiInputBase-root": { maxHeight: "40px" },
                      width: 200,
                    }}
                  />
                )}
              />
            </Box>
          </Box>

          <Box sx={{ textAlign: "center", my: 1 }}>
            <Typography variant="h6" fontWeight="medium">
              {persianMonths[month - 1]} {year}
            </Typography>
          </Box>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(7, 1fr)",
              textAlign: "center",
              border: 1,
              background: "#fff",
            }}
          >
            {weekDays.map((d) => (
              <Typography
                key={d}
                sx={{
                  width: "100%",
                  borderRight: 1,
                  fontSize: 14,
                  py: 1,
                  fontWeight: "bold",
                  color: "black !important",
                }}
              >
                {d}
              </Typography>
            ))}
          </Box>

          {calendarMatrix.map((week, i) => (
            <Box
              key={i}
              sx={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)" }}
            >
              {week.map((day, j) => {
                const holidaysOfDay = holidays.filter(
                  (h) =>
                    moment(h.date).format(dateFormat) ===
                    moment(day).format(dateFormat)
                );

                return (
                  <Box
                    key={j}
                    onClick={() => {
                      if (!holidaysOfDay.length && day) {
                        setSelectedHoliday({
                          date: moment(day).toDate(),
                          title: "",
                          id: null,
                        });
                        setAddModal(true);
                      }
                    }}
                    sx={{
                      border: "1px solid #ccc",
                      minHeight: 100,
                      position: "relative",
                      cursor: day ? "pointer" : "default",
                      backgroundColor: day
                        ? moment(day).isSame(moment(), "day")
                          ? "rgba(255,220,40,.15)"
                          : holidaysOfDay.length
                          ? darkMode
                            ? "#b44f4fff"
                            : "#ffb7b7ff"
                          : "transparent"
                        : "hsla(0,0%,82%,.3)",
                      color: "#202940",
                      padding: 1,
                      fontSize: 14,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "flex-start",
                      alignItems: "flex-start",
                      overflow: "hidden",
                    }}
                  >
                    {day && (
                      <>
                        <span style={{ fontWeight: "bold", marginBottom: 2 }}>
                          {moment(day).format("jD")}
                        </span>

                        {holidaysOfDay.map((h) => (
                          <Button
                            variant="outlined"
                            key={h.id}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDayClick(day, h);
                            }}
                            sx={{
                              fontSize: 12,
                              width: "100%",
                              justifyContent: "flex-start",
                              padding: "4px",
                              minHeight: 20,
                              mb: 1,
                              color: "#202940",
                              borderColor: "#202940",
                            }}
                            title={h.title}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" || e.key === " ") {
                                e.preventDefault();
                                handleDayClick(day, h);
                              }
                            }}
                          >
                            {h.title}
                          </Button>
                        ))}
                      </>
                    )}
                  </Box>
                );
              })}
            </Box>
          ))}
        </CardContent>

        {/* برای نمایش یک آلرت با کلیک روی هر تعطیلی*/}
        <style>{`
           .custom-swal-popup { background-color: ${
             darkMode ? "#202940" : "#FFF"
           }; color: ${darkMode ? "#fff" : "#202940"} } 
           .custom-swal-button {
              padding: 10px 25px !important;
              font-size: .9rem !important;
              border-color: none;
              border-radius: 6px !important;
              background-color: #1A73E8 !important;
              color: white !important;
              cursor: pointer ; 
            }
        `}</style>
      </Card>

      {/* for create a new date  */}
      {/* {addModal && (
        <Modal
          open={addModal}
          onClose={() => setAddModal(false)}
          initialData={selectedHoliday}
          reload={reload}
        />
      )} */}
    </Box>
  );
};

export default Calendar;
