import { DataTypes, IBackup } from "@/types"

export const v001backup = {
  days: [
    {
      date: "2024-09-22",
      symptomOverviews: [],
      symptoms: [
        {
          key: "symptom-Test",
          label: "Test",
          logs: [
            {
              key: "1731",
              time: "16:43",
              pain: 2,
              detail: "Details",
            },
          ],
        },
      ],
      logs: [],
      meds: [],
      meals: [],
      wakeUp: "16:43",
      goToBed: "",
      _id: "2024-09-22",
      _rev: "2-2c546795d57a73fc259b75734bd292a1",
    },
    {
      date: "2024-09-21",
      symptomOverviews: [],
      symptoms: [],
      logs: [],
      meds: [],
      meals: [
        {
          _id: "meal-Test",
          type: "meals",
          key: "Test",
          time: "11:59",
          detail: "Detail",
        },
      ],
      wakeUp: "16:43",
      goToBed: "16:43",
      _id: "2024-09-21",
      _rev: "3-d2355283c04c338981b4c99122c1be09",
    },
    {
      date: "2024-08-29",
      symptomOverviews: [],
      symptoms: [],
      logs: [],
      meds: [
        {
          _id: "med-Test Drug",
          type: "meds",
          key: "Test Drug",
          quantity: "50",
          occurrences: 0,
          lastEntry: "2000-01-01",
          log: [
            {
              key: "98",
              time: "16:44",
            },
          ],
        },
      ],
      meals: [],
      wakeUp: "",
      goToBed: "",
      _id: "2024-08-29",
      _rev: "1-211c4d3f682b6bf24bd9bf26ad1f8de0",
    },
    {
      date: "2024-08-27",
      symptomOverviews: [],
      symptoms: [],
      logs: [
        {
          _id: "note-Note Title",
          type: "note",
          key: "Note Title",
          occurrences: 0,
          lastEntry: "2000-01-01",
          log: [
            {
              key: "3274",
              time: "16:44",
              detail: "Details",
            },
          ],
        },
      ],
      meds: [],
      meals: [],
      wakeUp: "",
      goToBed: "",
      _id: "2024-08-27",
      _rev: "1-e19ebba67a0114c0b1fa534ab24f0fce",
    },
    {
      date: "2024-08-26",
      symptomOverviews: [],
      symptoms: [
        {
          key: "symptom-Test 2",
          label: "Test 2",
          logs: [
            {
              key: "867",
              time: "16:44",
              pain: 3,
              detail: "Symptom Details",
            },
          ],
        },
      ],
      logs: [
        {
          type: "note",
          key: "Note Title",
          occurrences: 1,
          lastEntry: "2024-08-27",
          _id: "note-Note Title",
          _rev: "2-4e74d2ef1e7a90a2f3c4aedb63b00390",
          log: [
            {
              key: "1889",
              time: "16:45",
              detail: "Test Details",
            },
          ],
        },
      ],
      meds: [
        {
          _id: "med-Test Drug",
          type: "meds",
          key: "Test Drug",
          quantity: "50",
          occurrences: 0,
          lastEntry: "2000-01-01",
          log: [
            {
              key: "2784",
              time: "16:45",
            },
          ],
        },
      ],
      meals: [
        {
          _id: "meal-Test Meal",
          type: "meals",
          key: "Test Meal",
          time: "16:45",
          detail: "Meal Detail",
        },
      ],
      wakeUp: "01:30",
      goToBed: "22:00",
      _id: "2024-08-26",
      _rev: "6-34c9c7671d2622e4edc2cb56d081ff02",
    },
  ],
  symptoms: [
    {
      key: "symptom-Test 2",
      label: "Test 2",
      logs: [],
      _id: "symptom-Test 2",
      _rev: "1-5afe00ada9031edbc1fc0bc5ebf81da9",
    },
    {
      key: "symptom-Test 1",
      label: "Test 1",
      logs: [],
      _id: "symptom-Test 1",
      _rev: "1-8e713559e6cb102e8d30c4faa57d649e",
    },
    {
      key: "symptom-Test",
      label: "Test",
      logs: [],
      _id: "symptom-Test",
      _rev: "1-8e012d667479da017048aa5a693d3e77",
    },
  ],
  meds: [
    {
      type: "meds",
      key: "Test Drug",
      occurrences: 2,
      lastEntry: "2024-08-29",
      quantity: "50",
      _id: "med-Test Drug",
      _rev: "3-856fd736f2b276ef7aefa6e9ca06badc",
    },
  ],
  notes: [
    {
      type: "note",
      key: "Note Title",
      occurrences: 2,
      lastEntry: "2024-08-27",
      _id: "note-Note Title",
      _rev: "3-b7872b79addf0cec8bd98d777332a331",
    },
  ],
  settings: {
    defaultSymptom: "none",
    language: "en",
    timeFormat: "24h",
    _id: "settings",
    _rev: "1-02015ed240e0476aa7afcf524f3c0146",
  },
  version: "0.0.1",
  _id: "backup",
  _rev: "6-0c8eb120ea31fc2f61e33e232a787da2",
} as unknown as IBackup

export const v001ExpectedData = {
  days: v001backup.days,
  settings: v001backup.settings,
  symptoms: v001backup.symptoms,
  meds: v001backup.meds,
  notes: v001backup.notes,
}

export const v000backup = {
  days: [
    {
      date: "2024-09-09",
      symptomOverviews: [],
      symptoms: [
        {
          type: "symptom",
          key: "test",
          logs: [{ type: "symptomLog", time: "17:00", key: "test", pain: 2, detail: "Tt" }],
        },
      ],
      logs: [{ type: "log", time: "14:52", key: "Test" }],
      meds: [{ type: "med", time: "12:56", key: "Test", quantity: "100" }],
      meals: [{ type: "meal", time: "22:17", key: "Test" }],
      wakeUp: "",
      goToBed: "",
      _id: "2024-09-09",
    },
  ],
  symptoms: [{ key: "test", label: "Test", _id: "test" }],
  settings: {
    targetSymptomKey: "test",
    language: "en",
    timeFormat: "eu",
    firstStart: false,
    lastInstall: "20240822T1436530200",
    _id: "settings",
  },
}

export const v000ExpectedData = {
  days: [
    {
      date: "2024-09-09",
      symptomOverviews: [],
      symptoms: [
        {
          _id: "symptom-test",
          key: "test",
          type: DataTypes.symptoms,
          logs: [{ key: "1", type: "symptomLog", time: "17:00", pain: 2, detail: "Tt" }],
        },
      ],
      logs: [
        {
          _id: "note-Test",
          type: DataTypes.note,
          key: "Test",
          log: [
            {
              key: "1",
              time: "14:52",
              detail: "",
            },
          ],
        },
      ],
      meds: [
        { type: DataTypes.meds, key: "Test", quantity: "100", _id: "med-Test", log: [{ key: "1", time: "12:56" }] },
      ],
      meals: [{ type: "meal", time: "22:17", key: "Test" }],
      wakeUp: "",
      goToBed: "",
      _id: "2024-09-09",
    },
  ],
  symptoms: [{ key: "test", label: "Test", _id: "symptom-test", logs: [] }],
  meds: [
    {
      _id: "med-Test",
      type: DataTypes.meds,
      occurrences: 1,
      lastEntry: "2024-09-09",
      key: "Test",
      quantity: "100",
    },
  ],
  notes: [{ _id: "note-Test", type: DataTypes.note, occurrences: 1, lastEntry: "2024-09-09", key: "Test" }],
  settings: {
    targetSymptomKey: "test",
    language: "en",
    timeFormat: "24h",
    firstStart: false,
    lastInstall: "20240822T1436530200",
    _id: "settings",
  },
}

export const v000Multiplebackup = {
  days: [
    {
      date: "2024-09-09",
      symptomOverviews: [],
      symptoms: [
        {
          type: "symptom",
          key: "test",
          logs: [
            { type: "symptomLog", time: "17:00", key: "test", pain: 2, detail: "Tt" },
            { type: "symptomLog", time: "18:00", key: "test", pain: 5, detail: "test" },
          ],
        },
      ],
      logs: [
        { type: "log", time: "14:52", key: "Test" },
        { type: "log", time: "15:52", key: "Test" },
      ],
      meds: [
        { type: "med", time: "12:56", key: "Test", quantity: "100" },
        { type: "med", time: "13:56", key: "Test", quantity: "100" },
      ],
      meals: [{ type: "meal", time: "22:17", key: "Test" }],
      wakeUp: "",
      goToBed: "",
      _id: "2024-09-09",
    },
  ],
  symptoms: [{ key: "test", label: "Test", _id: "test" }],
  settings: {
    targetSymptomKey: "test",
    language: "en",
    timeFormat: "eu",
    firstStart: false,
    lastInstall: "20240822T1436530200",
    _id: "settings",
  },
}

export const v000MultipleExpectedData = {
  days: [
    {
      date: "2024-09-09",
      symptomOverviews: [],
      symptoms: [
        {
          _id: "symptom-test",
          key: "test",
          type: DataTypes.symptoms,
          logs: [
            { key: "1", type: "symptomLog", time: "17:00", pain: 2, detail: "Tt" },
            { key: "2", type: "symptomLog", time: "18:00", pain: 5, detail: "test" },
          ],
        },
      ],
      logs: [
        {
          _id: "note-Test",
          type: DataTypes.note,
          key: "Test",
          log: [
            {
              key: "1",
              time: "14:52",
              detail: "",
            },
            {
              key: "2",
              time: "15:52",
              detail: "",
            },
          ],
        },
      ],
      meds: [
        {
          type: DataTypes.meds,
          key: "Test",
          quantity: "100",
          _id: "med-Test",
          log: [
            { key: "1", time: "12:56" },
            { key: "2", time: "13:56" },
          ],
        },
      ],
      meals: [{ type: "meal", time: "22:17", key: "Test" }],
      wakeUp: "",
      goToBed: "",
      _id: "2024-09-09",
    },
  ],
  symptoms: [{ key: "test", label: "Test", _id: "symptom-test", logs: [] }],
  meds: [
    {
      _id: "med-Test",
      type: DataTypes.meds,
      occurrences: 2,
      lastEntry: "2024-09-09",
      key: "Test",
      quantity: "100",
    },
  ],
  notes: [{ _id: "note-Test", type: "note", occurrences: 2, lastEntry: "2024-09-09", key: "Test" }],
  settings: {
    targetSymptomKey: "test",
    language: "en",
    timeFormat: "24h",
    firstStart: false,
    lastInstall: "20240822T1436530200",
    _id: "settings",
  },
}

export const v000Differentbackup = {
  days: [
    {
      date: "2024-09-09",
      symptomOverviews: [],
      symptoms: [
        {
          type: "symptom",
          key: "test",
          logs: [{ type: "symptomLog", time: "17:00", key: "test", pain: 2, detail: "Tt" }],
        },
        {
          type: "symptom",
          key: "test 2",
          logs: [{ type: "symptomLog", time: "18:00", key: "test", pain: 5, detail: "test" }],
        },
      ],
      logs: [
        { type: "log", time: "14:52", key: "Test" },
        { type: "log", time: "15:52", key: "Test 2" },
      ],
      meds: [
        { type: "med", time: "12:56", key: "Test", quantity: "100" },
        { type: "med", time: "13:56", key: "Test 2", quantity: "100" },
      ],
      meals: [{ type: "meal", time: "22:17", key: "Test" }],
      wakeUp: "",
      goToBed: "",
      _id: "2024-09-09",
    },
  ],
  symptoms: [
    { key: "test", label: "Test", _id: "test" },
    { key: "test 2", label: "Test 2", _id: "test 2" },
  ],
  settings: {
    targetSymptomKey: "test",
    language: "en",
    timeFormat: "eu",
    firstStart: false,
    lastInstall: "20240822T1436530200",
    _id: "settings",
  },
}

export const v000DifferentExpectedData = {
  days: [
    {
      date: "2024-09-09",
      symptomOverviews: [],
      symptoms: [
        {
          _id: "symptom-test",
          key: "test",
          type: DataTypes.symptoms,
          logs: [{ key: "1", type: "symptomLog", time: "17:00", pain: 2, detail: "Tt" }],
        },
        {
          _id: "symptom-test 2",
          key: "test 2",
          type: DataTypes.symptoms,
          logs: [{ key: "1", type: "symptomLog", time: "18:00", pain: 5, detail: "test" }],
        },
      ],
      logs: [
        {
          _id: "note-Test",
          type: DataTypes.note,
          key: "Test",
          log: [
            {
              key: "1",
              time: "14:52",
              detail: "",
            },
          ],
        },
        {
          _id: "note-Test 2",
          type: DataTypes.note,
          key: "Test 2",
          log: [
            {
              key: "1",
              time: "15:52",
              detail: "",
            },
          ],
        },
      ],
      meds: [
        {
          type: DataTypes.meds,
          key: "Test",
          quantity: "100",
          _id: "med-Test",
          log: [{ key: "1", time: "12:56" }],
        },
        {
          type: DataTypes.meds,
          key: "Test 2",
          quantity: "100",
          _id: "med-Test 2",
          log: [{ key: "1", time: "13:56" }],
        },
      ],
      meals: [{ type: "meal", time: "22:17", key: "Test" }],
      wakeUp: "",
      goToBed: "",
      _id: "2024-09-09",
    },
  ],
  symptoms: [
    { key: "test", label: "Test", _id: "symptom-test", logs: [] },
    { key: "test 2", label: "Test 2", _id: "symptom-test 2", logs: [] },
  ],
  meds: [
    {
      _id: "med-Test",
      type: DataTypes.meds,
      occurrences: 1,
      lastEntry: "2024-09-09",
      key: "Test",
      quantity: "100",
    },
    {
      _id: "med-Test 2",
      type: DataTypes.meds,
      occurrences: 1,
      lastEntry: "2024-09-09",
      key: "Test 2",
      quantity: "100",
    },
  ],
  notes: [
    { _id: "note-Test", type: "note", occurrences: 1, lastEntry: "2024-09-09", key: "Test" },
    { _id: "note-Test 2", type: "note", occurrences: 1, lastEntry: "2024-09-09", key: "Test 2" },
  ],
  settings: {
    targetSymptomKey: "test",
    language: "en",
    timeFormat: "24h",
    firstStart: false,
    lastInstall: "20240822T1436530200",
    _id: "settings",
  },
}

export const v000DifferentDaysbackup = {
  days: [
    {
      date: "2024-09-09",
      symptomOverviews: [],
      symptoms: [
        {
          type: "symptom",
          key: "test",
          logs: [{ type: "symptomLog", time: "17:00", key: "test", pain: 2, detail: "Tt" }],
        },
        {
          type: "symptom",
          key: "test 2",
          logs: [{ type: "symptomLog", time: "18:00", key: "test", pain: 5, detail: "test" }],
        },
      ],
      logs: [
        { type: "log", time: "14:52", key: "Test" },
        { type: "log", time: "15:52", key: "Test 2" },
      ],
      meds: [
        { type: "med", time: "12:56", key: "Test", quantity: "100" },
        { type: "med", time: "13:56", key: "Test 2", quantity: "100" },
      ],
      meals: [{ type: "meal", time: "22:17", key: "Test" }],
      wakeUp: "",
      goToBed: "",
      _id: "2024-09-09",
    },
    {
      date: "2024-09-08",
      symptomOverviews: [],
      symptoms: [
        {
          type: "symptom",
          key: "test",
          logs: [{ type: "symptomLog", time: "17:00", key: "test", pain: 2, detail: "Tt" }],
        },
        {
          type: "symptom",
          key: "test 2",
          logs: [{ type: "symptomLog", time: "18:00", key: "test", pain: 5, detail: "test" }],
        },
      ],
      logs: [
        { type: "log", time: "14:52", key: "Test" },
        { type: "log", time: "15:52", key: "Test 2" },
      ],
      meds: [
        { type: "med", time: "12:56", key: "Test", quantity: "100" },
        { type: "med", time: "13:56", key: "Test 2", quantity: "100" },
      ],
      meals: [{ type: "meal", time: "22:17", key: "Test" }],
      wakeUp: "",
      goToBed: "",
      _id: "2024-09-08",
    },
  ],
  symptoms: [
    { key: "test", label: "Test", _id: "test" },
    { key: "test 2", label: "Test 2", _id: "test 2" },
  ],
  settings: {
    targetSymptomKey: "test",
    language: "en",
    timeFormat: "eu",
    firstStart: false,
    lastInstall: "20240822T1436530200",
    _id: "settings",
  },
}

export const v000DifferentDaysExpectedData = {
  days: [
    {
      date: "2024-09-09",
      symptomOverviews: [],
      symptoms: [
        {
          _id: "symptom-test",
          key: "test",
          type: DataTypes.symptoms,
          logs: [{ key: "1", type: "symptomLog", time: "17:00", pain: 2, detail: "Tt" }],
        },
        {
          _id: "symptom-test 2",
          key: "test 2",
          type: DataTypes.symptoms,
          logs: [{ key: "1", type: "symptomLog", time: "18:00", pain: 5, detail: "test" }],
        },
      ],
      logs: [
        {
          _id: "note-Test",
          type: DataTypes.note,
          key: "Test",
          log: [
            {
              key: "1",
              time: "14:52",
              detail: "",
            },
          ],
        },
        {
          _id: "note-Test 2",
          type: DataTypes.note,
          key: "Test 2",
          log: [
            {
              key: "1",
              time: "15:52",
              detail: "",
            },
          ],
        },
      ],
      meds: [
        {
          type: DataTypes.meds,
          key: "Test",
          quantity: "100",
          _id: "med-Test",
          log: [{ key: "1", time: "12:56" }],
        },
        {
          type: DataTypes.meds,
          key: "Test 2",
          quantity: "100",
          _id: "med-Test 2",
          log: [{ key: "1", time: "13:56" }],
        },
      ],
      meals: [{ type: "meal", time: "22:17", key: "Test" }],
      wakeUp: "",
      goToBed: "",
      _id: "2024-09-09",
    },
    {
      date: "2024-09-08",
      symptomOverviews: [],
      symptoms: [
        {
          _id: "symptom-test",
          key: "test",
          type: DataTypes.symptoms,
          logs: [{ key: "1", type: "symptomLog", time: "17:00", pain: 2, detail: "Tt" }],
        },
        {
          _id: "symptom-test 2",
          key: "test 2",
          type: DataTypes.symptoms,
          logs: [{ key: "1", type: "symptomLog", time: "18:00", pain: 5, detail: "test" }],
        },
      ],
      logs: [
        {
          _id: "note-Test",
          type: DataTypes.note,
          key: "Test",
          log: [
            {
              key: "1",
              time: "14:52",
              detail: "",
            },
          ],
        },
        {
          _id: "note-Test 2",
          type: DataTypes.note,
          key: "Test 2",
          log: [
            {
              key: "1",
              time: "15:52",
              detail: "",
            },
          ],
        },
      ],
      meds: [
        {
          type: DataTypes.meds,
          key: "Test",
          quantity: "100",
          _id: "med-Test",
          log: [{ key: "1", time: "12:56" }],
        },
        {
          type: DataTypes.meds,
          key: "Test 2",
          quantity: "100",
          _id: "med-Test 2",
          log: [{ key: "1", time: "13:56" }],
        },
      ],
      meals: [{ type: "meal", time: "22:17", key: "Test" }],
      wakeUp: "",
      goToBed: "",
      _id: "2024-09-08",
    },
  ],
  symptoms: [
    { key: "test", label: "Test", _id: "symptom-test", logs: [] },
    { key: "test 2", label: "Test 2", _id: "symptom-test 2", logs: [] },
  ],
  meds: [
    {
      _id: "med-Test",
      type: DataTypes.meds,
      occurrences: 2,
      lastEntry: "2024-09-09",
      key: "Test",
      quantity: "100",
    },
    {
      _id: "med-Test 2",
      type: DataTypes.meds,
      occurrences: 2,
      lastEntry: "2024-09-09",
      key: "Test 2",
      quantity: "100",
    },
  ],
  notes: [
    { _id: "note-Test", type: "note", occurrences: 2, lastEntry: "2024-09-09", key: "Test" },
    { _id: "note-Test 2", type: "note", occurrences: 2, lastEntry: "2024-09-09", key: "Test 2" },
  ],
  settings: {
    targetSymptomKey: "test",
    language: "en",
    timeFormat: "24h",
    firstStart: false,
    lastInstall: "20240822T1436530200",
    _id: "settings",
  },
}
