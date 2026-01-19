# Appointments Module - Quick Reference

## 🚀 Quick Start

### View Appointments
```
Navigate to: /appointments
```

### Create New Appointment
```
Click: "New Appointment" button
Or navigate to: /appointments/new
```

### Edit Appointment
```
Click: "Edit" button on any appointment
Or navigate to: /appointments/:id/edit
```

### View Details
```
Click: Appointment title
Or navigate to: /appointments/:id
```

---

## 📁 File Locations

```
src/
├── pages/appointments/
│   ├── AppointmentsList.jsx    ← Main list page
│   ├── NewAppointment.jsx      ← Create page
│   ├── EditAppointment.jsx     ← Edit page
│   └── AppointmentDetails.jsx  ← Details page
│
└── components/
    ├── appointments/
    │   └── AppointmentCard.jsx ← Card component
    └── forms/
        └── AppointmentForm.jsx ← Form component
```

---

## 🎯 Key Features

### List Page
- **Stats**: Total, Confirmed, Pending, Today
- **Search**: By client name or title
- **Filter**: By status
- **Views**: Grid or Table
- **Actions**: Edit, Delete, Confirm

### Form
- **Required**: Title, Client Name, Date, Time
- **Optional**: Type, Duration, Priority, Status, Notes
- **Validation**: Client-side with error messages

### Details
- **Info**: Full appointment details
- **Client**: Name, email, phone
- **Actions**: Confirm, Complete, Cancel, Email, Reminder

---

## 🎨 Mock Data

5 sample appointments included:
1. Sarah Johnson - Initial Consultation (Confirmed)
2. Michael Chen - Follow-up Meeting (Confirmed)
3. Emma Wilson - Case Review (Pending)
4. James Brown - Initial Assessment (Pending)
5. Lisa Anderson - Consultation (Confirmed)

---

## 🔄 Common Tasks

### Add New Appointment
1. Click "New Appointment"
2. Fill required fields (Title, Client, Date, Time)
3. Click "Create Appointment"
4. ✓ Redirects to list with success message

### Edit Appointment
1. Click "Edit" on appointment
2. Modify fields
3. Click "Update Appointment"
4. ✓ Redirects to list with success message

### Delete Appointment
1. Click "Delete" button
2. Confirm in dialog
3. ✓ Appointment removed with success message

### Change Status
1. Click status action button (Confirm/Complete/Cancel)
2. ✓ Status updates immediately

### Search Appointments
1. Type in search box
2. ✓ List filters in real-time

### Filter by Status
1. Select status from dropdown
2. ✓ List updates immediately

### Toggle View
1. Click "Grid" or "Table" button
2. ✓ View changes instantly

---

## 🎨 Status Colors

| Status    | Color  | Badge |
|-----------|--------|-------|
| Confirmed | Green  | ✓     |
| Pending   | Yellow | ⏳    |
| Cancelled | Red    | ✕     |
| Completed | Blue   | ✓     |

---

## 🎯 Priority Colors

| Priority | Color  |
|----------|--------|
| High     | Red    |
| Medium   | Yellow |
| Low      | Green  |

---

## 📱 Responsive Breakpoints

| Device  | Width      | Columns |
|---------|------------|---------|
| Mobile  | < 768px    | 1       |
| Tablet  | 768-1024px | 2       |
| Desktop | > 1024px   | 3       |

---

## 🔧 Component Props

### AppointmentCard
```jsx
appointment: {
  id, title, clientName, type,
  date, time, duration, priority,
  status, notes
}
onEdit: (appointment) => void
onDelete: (id) => void
onStatusChange: (id, status) => void
```

### AppointmentForm
```jsx
initialData: appointment | null
onSubmit: (formData) => void
onCancel: () => void
```

---

## 🛣️ Routes

| Path                      | Component           | Purpose        |
|---------------------------|---------------------|----------------|
| /appointments             | AppointmentsList    | List all       |
| /appointments/new         | NewAppointment      | Create new     |
| /appointments/:id         | AppointmentDetails  | View details   |
| /appointments/:id/edit    | EditAppointment     | Edit existing  |

---

## 💡 Tips

### Performance
- Mock data loads instantly
- No API calls yet
- State managed locally

### Validation
- Required fields marked with *
- Errors show below fields
- Can't submit invalid form

### Navigation
- Back buttons on all pages
- Breadcrumb-style navigation
- Redirects after actions

### Dark Mode
- Toggle in topbar
- All components support it
- Automatic color adjustments

---

## 🐛 Troubleshooting

### Appointment not showing?
- Check search query
- Check status filter
- Verify mock data

### Form not submitting?
- Check required fields
- Look for error messages
- Ensure all fields valid

### Edit not working?
- Verify appointment ID exists
- Check mock data array
- Ensure route is correct

### Delete confirmation not showing?
- Check browser allows dialogs
- Verify onClick handler
- Check console for errors

---

## 🔮 Next Steps

### To Add Backend:
1. Replace mock data with API calls
2. Update CRUD operations
3. Add loading states
4. Handle errors
5. Implement pagination

### To Enhance:
1. Add recurring appointments
2. Implement notifications
3. Add calendar view
4. Export functionality
5. Advanced filters

---

## 📞 Quick Commands

```bash
# Start dev server
npm run dev

# Navigate to appointments
http://localhost:3000/appointments

# Create new
http://localhost:3000/appointments/new

# View details
http://localhost:3000/appointments/1

# Edit
http://localhost:3000/appointments/1/edit
```

---

## ✅ Checklist

Before deploying:
- [ ] Test all CRUD operations
- [ ] Verify responsive design
- [ ] Check dark mode
- [ ] Test form validation
- [ ] Verify navigation
- [ ] Test search/filter
- [ ] Check mobile view
- [ ] Verify status changes

---

**Need help? Check APPOINTMENTS_MODULE.md for detailed documentation!**
