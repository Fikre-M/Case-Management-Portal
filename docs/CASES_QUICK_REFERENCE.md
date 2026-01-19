# Cases Module - Quick Reference

## 🚀 Quick Start

### View Cases
```
Navigate to: /cases
```

### Create New Case
```
Click: "New Case" button
Or navigate to: /cases/new
```

### Edit Case
```
Click: "Edit" button on any case
Or navigate to: /cases/:id/edit
```

### View Details
```
Click: Case title
Or navigate to: /cases/:id
```

---

## 📁 File Locations

```
src/
├── pages/cases/
│   ├── CaseList.jsx         ← Main list page
│   ├── NewCase.jsx          ← Create page
│   ├── EditCase.jsx         ← Edit page
│   └── CaseDetails.jsx      ← Details page
│
└── components/
    ├── cases/
    │   └── CaseCard.jsx     ← Card component
    └── forms/
        └── CaseForm.jsx     ← Form component
```

---

## 🎯 Key Features

### List Page
- **Stats**: Total, Active, Pending, Closed
- **Search**: By case number, client name, or title
- **Filters**: Status AND Priority
- **Views**: Grid or Table
- **Actions**: Edit, Delete, Activate

### Form
- **Required**: Title, Client Name, Assigned To
- **Optional**: Type, Status, Priority, Due Date, Progress, Description, Next Action
- **Validation**: Client-side with error messages

### Details
- **Info**: Full case details with timeline
- **Client**: Name, email, phone
- **Documents**: List with download links
- **Notes**: Case notes with author and date
- **Actions**: Activate, Hold, Close, Email, Report, Schedule

---

## 🎨 Mock Data

5 sample cases included:
1. Employment Discrimination Case (Active, High)
2. Contract Dispute Resolution (Active, Medium)
3. Family Law Consultation (Pending, Low)
4. Personal Injury Claim (Active, High)
5. Property Rights Dispute (Closed, Medium)

---

## 🔄 Common Tasks

### Add New Case
1. Click "New Case"
2. Fill required fields (Title, Client, Assigned To)
3. Click "Create Case"
4. ✓ Redirects to list with success message

### Edit Case
1. Click "Edit" on case
2. Modify fields
3. Click "Update Case"
4. ✓ Redirects to list with success message

### Delete Case
1. Click "Delete" button
2. Confirm in dialog
3. ✓ Case removed with success message

### Change Status
1. Click status action button (Activate/Hold/Close)
2. ✓ Status updates immediately

### Search Cases
1. Type in search box
2. ✓ List filters in real-time

### Filter Cases
1. Select status from dropdown
2. Select priority from dropdown
3. ✓ List updates immediately

### Toggle View
1. Click "Grid" or "Table" button
2. ✓ View changes instantly

---

## 🎨 Case Types

| Type            | Icon |
|-----------------|------|
| General         | 📁   |
| Employment      | 💼   |
| Contract        | 📄   |
| Family          | 👨‍👩‍👧‍👦   |
| Personal Injury | 🏥   |
| Property        | 🏠   |
| Criminal        | ⚖️   |
| Immigration     | 🛂   |
| Other           | 📋   |

---

## 🎨 Status Colors

| Status   | Color  | Badge |
|----------|--------|-------|
| Active   | Green  | ✓     |
| Pending  | Yellow | ⏳    |
| On Hold  | Gray   | ⏸️    |
| Closed   | Blue   | ✓     |

---

## 🎯 Priority Colors

| Priority | Color  | Badge |
|----------|--------|-------|
| High     | Red    | 🔴    |
| Medium   | Yellow | 🟡    |
| Low      | Blue   | 🔵    |

---

## 📱 Responsive Breakpoints

| Device  | Width      | Columns |
|---------|------------|---------|
| Mobile  | < 768px    | 1       |
| Tablet  | 768-1024px | 2       |
| Desktop | > 1024px   | 3       |

---

## 🔧 Component Props

### CaseCard
```jsx
caseItem: {
  id, caseNumber, title, clientName,
  type, status, priority, assignedTo,
  progress, nextAction, dueDate
}
onEdit: (caseItem) => void
onDelete: (id) => void
onStatusChange: (id, status) => void
```

### CaseForm
```jsx
initialData: caseItem | null
onSubmit: (formData) => void
onCancel: () => void
```

---

## 🛣️ Routes

| Path              | Component    | Purpose        |
|-------------------|--------------|----------------|
| /cases            | CaseList     | List all       |
| /cases/new        | NewCase      | Create new     |
| /cases/:id        | CaseDetails  | View details   |
| /cases/:id/edit   | EditCase     | Edit existing  |

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

### Progress Tracking
- 0-100% range
- Visual progress bar
- Percentage display

---

## 🐛 Troubleshooting

### Case not showing?
- Check search query
- Check status filter
- Check priority filter
- Verify mock data

### Form not submitting?
- Check required fields
- Look for error messages
- Ensure all fields valid

### Edit not working?
- Verify case ID exists
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
1. Add document upload
2. Implement email system
3. Add task management
4. Time tracking
5. Billing integration
6. Client portal

---

## 📞 Quick Commands

```bash
# Start dev server
npm run dev

# Navigate to cases
http://localhost:3000/cases

# Create new
http://localhost:3000/cases/new

# View details
http://localhost:3000/cases/1

# Edit
http://localhost:3000/cases/1/edit
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
- [ ] Test progress bars
- [ ] Check timeline display

---

**Need help? Check CASES_MODULE.md for detailed documentation!**
